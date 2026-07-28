import { mkdir, mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { _electron as electron, ElectronApplication, Page } from 'playwright';
import { test as base, expect } from '@playwright/test';
import { AzureCli, DeviceSimulator } from './azureCli';
import { bootstrapE2E, E2EContext } from './bootstrap';
import { E2EEnvironment, redactSecrets } from './environment';
import { IoTHubRegistry } from './iotHubRegistry';

interface DeviceRegistry {
    create(deviceId: string, options?: Parameters<IoTHubRegistry['createDevice']>[1]): Promise<void>;
    track(deviceId: string): void;
}

interface ModuleRegistry {
    track(deviceId: string, moduleId: string): void;
}

interface E2EWorkerFixtures {
    azureCli: AzureCli;
    e2eContext: E2EContext;
    environment: E2EEnvironment;
    iotHubRegistry: IoTHubRegistry;
}

interface E2EFixtures {
    app: ElectronApplication;
    deviceRegistry: DeviceRegistry;
    electronSession: ElectronSession;
    moduleRegistry: ModuleRegistry;
    page: Page;
    simulators: {
        start(options: Parameters<AzureCli['startSimulator']>[0]): Promise<DeviceSimulator>;
    };
}

interface ElectronSession {
    readonly app: ElectronApplication;
    readonly page: Page;
    relaunch(): Promise<Page>;
}

export const test = base.extend<E2EFixtures, E2EWorkerFixtures>({
    e2eContext: [async ({}, use) => {
        await use(await bootstrapE2E());
    }, { scope: 'worker' }],

    environment: [async ({ e2eContext }, use) => {
        await use(e2eContext.environment);
    }, { scope: 'worker' }],

    azureCli: [async ({ e2eContext }, use) => {
        await use(e2eContext.azureCli);
    }, { scope: 'worker' }],

    iotHubRegistry: [async ({ environment }, use) => {
        await use(new IoTHubRegistry(environment));
    }, { scope: 'worker' }],

    electronSession: async ({ environment }, use, testInfo) => {
        const profileRoot = await mkdir(path.join(tmpdir(), 'azure-iot-explorer-e2e'), { recursive: true })
            .then(() => mkdtemp(path.join(tmpdir(), 'azure-iot-explorer-e2e', 'profile-')));
        const appPath = path.resolve(__dirname, '..', '..');
        const logs: string[] = [];
        const rendererErrors: string[] = [];
        const pageErrors: string[] = [];
        let currentApp!: ElectronApplication;
        let currentPage!: Page;

        const launch = async (): Promise<Page> => {
            currentApp = await electron.launch({
                args: [
                    `--user-data-dir=${profileRoot}`,
                    appPath,
                ],
                env: {
                    ...process.env,
                    NODE_ENV: 'production',
                },
                timeout: 60_000,
            });
            const childProcess = currentApp.process();
            childProcess.stdout?.on('data', chunk => logs.push(chunk.toString()));
            childProcess.stderr?.on('data', chunk => logs.push(chunk.toString()));
            currentPage = await currentApp.firstWindow();
            currentPage.on('console', message => {
                if (message.type() === 'error') {
                    rendererErrors.push(message.text());
                }
            });
            currentPage.on('pageerror', error => pageErrors.push(error.stack || error.message));
            await currentPage.waitForLoadState('domcontentloaded');
            return currentPage;
        };

        try {
            await launch();
            const session: ElectronSession = {
                get app() {
                    return currentApp;
                },
                get page() {
                    return currentPage;
                },
                relaunch: async () => {
                    await currentApp.close();
                    return launch();
                },
            };
            await use(session);

            if (testInfo.status !== testInfo.expectedStatus || pageErrors.length > 0) {
                const safeRendererLogs = redactSecrets([...rendererErrors, ...pageErrors].join('\n'), environment);
                if (safeRendererLogs) {
                    await testInfo.attach('electron-renderer.log', {
                        body: Buffer.from(safeRendererLogs),
                        contentType: 'text/plain',
                    });
                }
                if (logs.length > 0) {
                    await testInfo.attach('electron-main.log', {
                        body: Buffer.from(redactSecrets(logs.join(''), environment)),
                        contentType: 'text/plain',
                    });
                }

                const sensitiveFieldVisible = await Promise.all([
                    currentPage.getByLabel('Connection string', { exact: true }).isVisible().catch(() => false),
                    currentPage.getByLabel('Custom event hub connection string', { exact: true }).isVisible().catch(() => false),
                ]).then(results => results.some(Boolean));
                if (!sensitiveFieldVisible) {
                    await testInfo.attach('failure.png', {
                        body: await currentPage.screenshot(),
                        contentType: 'image/png',
                    });
                }
            }

            expect(pageErrors, `Unexpected renderer page errors:\n${pageErrors.join('\n')}`).toEqual([]);
        } finally {
            await currentApp?.close().catch(() => undefined);
            await rm(profileRoot, { force: true, recursive: true });
        }
    },

    app: async ({ electronSession }, use) => {
        await use(electronSession.app);
    },

    page: async ({ electronSession }, use) => {
        await use(electronSession.page);
    },

    deviceRegistry: async ({ iotHubRegistry }, use) => {
        const trackedDevices = new Set<string>();
        const registry: DeviceRegistry = {
            create: async (deviceId, options) => {
                trackedDevices.add(deviceId);
                await iotHubRegistry.createDevice(deviceId, options);
            },
            track: deviceId => trackedDevices.add(deviceId),
        };

        try {
            await use(registry);
        } finally {
            const cleanupErrors: Error[] = [];
            for (const deviceId of trackedDevices) {
                try {
                    await iotHubRegistry.deleteDevice(deviceId);
                } catch (error) {
                    cleanupErrors.push(error as Error);
                }
            }
            if (cleanupErrors.length > 0) {
                throw new AggregateError(cleanupErrors, 'Failed to clean up one or more E2E devices.');
            }
        }
    },

    moduleRegistry: async ({ iotHubRegistry, deviceRegistry }, use) => {
        void deviceRegistry;
        const trackedModules = new Map<string, { deviceId: string, moduleId: string }>();
        await use({
            track: (deviceId, moduleId) => trackedModules.set(`${deviceId}\0${moduleId}`, { deviceId, moduleId }),
        });

        const cleanupErrors: Error[] = [];
        for (const { deviceId, moduleId } of trackedModules.values()) {
            try {
                await iotHubRegistry.deleteModule(deviceId, moduleId);
            } catch (error) {
                cleanupErrors.push(error as Error);
            }
        }
        if (cleanupErrors.length > 0) {
            throw new AggregateError(cleanupErrors, 'Failed to clean up one or more E2E modules.');
        }
    },

    simulators: async ({ azureCli }, use, testInfo) => {
        const running = new Set<DeviceSimulator>();
        await use({
            start: async options => {
                const simulator = await azureCli.startSimulator(options);
                running.add(simulator);
                return simulator;
            },
        });

        const cleanupErrors: Error[] = [];
        for (const simulator of running) {
            try {
                if (testInfo.status !== testInfo.expectedStatus && simulator.diagnostics) {
                    await testInfo.attach('azure-cli-simulator.log', {
                        body: Buffer.from(simulator.diagnostics),
                        contentType: 'text/plain',
                    });
                }
            } catch (error) {
                cleanupErrors.push(error as Error);
            }
            try {
                await simulator.stop();
            } catch (error) {
                cleanupErrors.push(error as Error);
            }
        }
        if (cleanupErrors.length > 0) {
            throw new AggregateError(cleanupErrors, 'Failed to clean up one or more Azure CLI device simulators.');
        }
    },
});

export { expect };
