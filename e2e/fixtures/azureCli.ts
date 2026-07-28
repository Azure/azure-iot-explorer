import { execFile, execFileSync, spawn } from 'node:child_process';
import type { ChildProcess, ChildProcessByStdio } from 'node:child_process';
import { randomBytes } from 'node:crypto';
import { existsSync } from 'node:fs';
import { mkdir, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import type { Readable } from 'node:stream';
import { redactSecrets } from './environment.ts';
import type { E2EConfiguration } from './environment.ts';

interface CommandResult {
    exitCode: number;
    stderr: string;
    stdout: string;
}

interface SimulatorOptions {
    data: string;
    deviceId: string;
    messageCount?: number;
    messageIntervalSeconds?: number;
    methodResponseCode?: number;
    methodResponsePayload?: string;
    properties?: string;
}

const MAX_COMMAND_OUTPUT = 10 * 1024 * 1024;

interface AzureCliExecutable {
    command: string;
    prefixArgs: string[];
}

const findOnPath = (executable: string): string[] => {
    try {
        return execFileSync('where.exe', [executable], {
            encoding: 'utf8',
            stdio: ['ignore', 'pipe', 'ignore'],
            windowsHide: true,
        })
            .split(/\r?\n/)
            .map(value => value.trim())
            .filter(Boolean);
    } catch {
        return [];
    }
};

const resolveAzureCliExecutable = (): AzureCliExecutable => {
    if (process.platform !== 'win32') {
        return { command: 'az', prefixArgs: [] };
    }

    const nativeExecutable = findOnPath('az.exe')[0];
    if (nativeExecutable) {
        return { command: nativeExecutable, prefixArgs: [] };
    }

    for (const commandFile of findOnPath('az.cmd')) {
        const bundledPython = path.resolve(path.dirname(commandFile), '..', 'python.exe');
        if (existsSync(bundledPython)) {
            return { command: bundledPython, prefixArgs: ['-IBm', 'azure.cli'] };
        }
    }

    throw new Error('Unable to find an executable Azure CLI installation. Install Azure CLI and ensure `az` is on PATH.');
};

const getProcessInvocation = (executable: AzureCliExecutable, args: string[]): { command: string, args: string[] } => {
    return {
        command: executable.command,
        args: [...executable.prefixArgs, ...args],
    };
};

const terminateWindowsProcessTree = (pid: number): Promise<void> => {
    return new Promise((resolve, reject) => {
        execFile(
            'taskkill.exe',
            ['/PID', String(pid), '/T', '/F'],
            { timeout: 10_000, windowsHide: true },
            (error, _stdout, stderr) => {
                const details = `${error?.message || ''}\n${stderr || ''}`;
                if (error && !/not found|no running instance/i.test(details)) {
                    reject(error);
                    return;
                }
                resolve();
            }
        );
    });
};

const terminateProcessTree = async (processHandle: ChildProcess): Promise<void> => {
    if (process.platform === 'win32' && processHandle.pid) {
        await terminateWindowsProcessTree(processHandle.pid);
        return;
    }
    processHandle.kill('SIGKILL');
};

const execute = (executable: AzureCliExecutable, args: string[], timeout = 60_000): Promise<CommandResult> => {
    const invocation = getProcessInvocation(executable, args);
    return new Promise(resolve => {
        const processHandle = spawn(invocation.command, invocation.args, {
            shell: false,
            stdio: ['ignore', 'pipe', 'pipe'],
            windowsHide: true,
        });
        let stderr = '';
        let stdout = '';
        let timedOut = false;
        let outputExceeded = false;
        let completed = false;

        const finish = (exitCode: number) => {
            if (completed) {
                return;
            }
            completed = true;
            clearTimeout(timer);
            if (timedOut) {
                stderr += `\nAzure CLI command timed out after ${timeout}ms.`;
            }
            if (outputExceeded) {
                stderr += `\nAzure CLI command exceeded ${MAX_COMMAND_OUTPUT} bytes of output.`;
            }
            resolve({ exitCode, stderr, stdout });
        };

        const collect = (target: 'stderr' | 'stdout', chunk: Buffer) => {
            if (target === 'stderr') {
                stderr += chunk.toString();
            } else {
                stdout += chunk.toString();
            }
            if (!outputExceeded && Buffer.byteLength(stderr) + Buffer.byteLength(stdout) > MAX_COMMAND_OUTPUT) {
                outputExceeded = true;
                void terminateProcessTree(processHandle).catch(error => stderr += `\nFailed to stop Azure CLI: ${error.message}`);
            }
        };

        processHandle.stdout.on('data', chunk => collect('stdout', chunk));
        processHandle.stderr.on('data', chunk => collect('stderr', chunk));
        processHandle.once('error', error => {
            stderr += error.message;
            finish(1);
        });
        processHandle.once('exit', code => finish(code ?? 1));

        const timer = setTimeout(() => {
            timedOut = true;
            void terminateProcessTree(processHandle).catch(error => {
                stderr += `\nFailed to stop timed-out Azure CLI command: ${error.message}`;
                finish(1);
            });
        }, timeout);
    });
};

export class AzureCli {
    public readonly executable: AzureCliExecutable;
    public readonly configuration: E2EConfiguration;
    private connectionString?: string;

    public constructor(configuration: E2EConfiguration) {
        this.executable = resolveAzureCliExecutable();
        this.configuration = configuration;
    }

    public async preflight(): Promise<void> {
        await this.run(
            ['account', 'show', '--query', 'id', '--output', 'tsv'],
            'Azure CLI is not logged in or cannot access the configured subscription. Run `az login` before the E2E suite.'
        );
        const extensionResult = await execute(
            this.executable,
            ['extension', 'show', '--name', 'azure-iot', '--query', 'version', '--output', 'tsv']
        );
        if (extensionResult.exitCode !== 0) {
            throw this.commandError(extensionResult, 'The Azure CLI azure-iot extension is required. Install it with `az extension add --name azure-iot`.');
        }
    }

    public async getIoTHubConnectionString(): Promise<string> {
        const result = await this.run([
            'iot', 'hub', 'connection-string', 'show',
            '--hub-name', this.configuration.hubName,
            '--policy-name', 'iothubowner',
            '--query', 'connectionString',
            '--output', 'tsv',
            '--only-show-errors',
        ], 'Unable to retrieve the IoT Hub connection string. Ensure the signed-in identity can list IoT Hub keys.');
        const connectionString = result.stdout.trim();
        if (!connectionString) {
            throw new Error('The test hub did not return an IoT Hub connection string.');
        }
        this.connectionString = connectionString;
        return connectionString;
    }

    public async getBuiltInEventHubConnectionString(): Promise<string> {
        const result = await this.run([
            'iot', 'hub', 'connection-string', 'show',
            '--hub-name', this.configuration.hubName,
            '--default-eventhub',
            '--query', 'connectionString',
            '--output', 'tsv',
            '--only-show-errors',
        ]);
        const connectionString = result.stdout.trim();
        if (!connectionString) {
            throw new Error('The test hub did not return a built-in Event Hub-compatible connection string.');
        }
        return connectionString;
    }

    public async startSimulator(options: SimulatorOptions): Promise<DeviceSimulator> {
        const temporaryFiles: string[] = [];
        const args = [
            'iot', 'device', 'simulate',
            '--hub-name', this.configuration.hubName,
            '--device-id', options.deviceId,
            '--protocol', 'mqtt',
            '--msg-count', String(options.messageCount ?? 20),
            '--msg-interval', String(options.messageIntervalSeconds ?? 1),
            '--data', options.data,
            '--subscription', this.configuration.subscriptionId,
        ];

        if (options.properties) {
            args.push('--properties', options.properties);
        }
        if (options.methodResponseCode !== undefined) {
            args.push('--method-response-code', String(options.methodResponseCode));
        }
        if (options.methodResponsePayload) {
            const temporaryDirectory = path.join(process.cwd(), 'e2e', '.tmp');
            await mkdir(temporaryDirectory, { recursive: true });
            const responsePath = path.join(temporaryDirectory, `method-response-${randomBytes(6).toString('hex')}.json`);
            await writeFile(responsePath, options.methodResponsePayload, { encoding: 'utf8', flag: 'wx' });
            temporaryFiles.push(responsePath);
            args.push('--method-response-payload', responsePath);
        }

        const invocation = getProcessInvocation(this.executable, args);
        const processHandle = spawn(invocation.command, invocation.args, {
            shell: false,
            stdio: ['ignore', 'pipe', 'pipe'],
            windowsHide: true,
        });
        const simulator = new DeviceSimulator(processHandle, this.connectionString, temporaryFiles);
        await simulator.waitUntilReady();
        return simulator;
    }

    private async run(args: string[], failureMessage?: string): Promise<CommandResult> {
        const result = await this.runAllowFailure(args);
        if (result.exitCode !== 0) {
            throw this.commandError(result, failureMessage);
        }
        return result;
    }

    private runAllowFailure(args: string[]): Promise<CommandResult> {
        return execute(this.executable, [...args, '--subscription', this.configuration.subscriptionId]);
    }

    private commandError(result: CommandResult, message = 'Azure CLI command failed.'): Error {
        const environment = this.connectionString ? { connectionString: this.connectionString } : undefined;
        const details = redactSecrets(`${result.stderr}\n${result.stdout}`.trim(), environment);
        return new Error(`${message}${details ? `\n${details}` : ''}`);
    }
}

export class DeviceSimulator {
    private readonly connectionString?: string;
    private output = '';
    private readonly processHandle: ChildProcessByStdio<null, Readable, Readable>;
    private readonly temporaryFiles: string[];
    private readonly exitPromise: Promise<number | null>;

    public constructor(
        processHandle: ChildProcessByStdio<null, Readable, Readable>,
        connectionString: string | undefined,
        temporaryFiles: string[]
    ) {
        this.processHandle = processHandle;
        this.connectionString = connectionString;
        this.temporaryFiles = temporaryFiles;
        processHandle.stdout.on('data', chunk => this.output += chunk.toString());
        processHandle.stderr.on('data', chunk => this.output += chunk.toString());
        this.exitPromise = new Promise(resolve => processHandle.once('exit', resolve));
    }

    public get diagnostics(): string {
        const environment = this.connectionString ? { connectionString: this.connectionString } : undefined;
        return redactSecrets(this.output, environment);
    }

    public async waitUntilReady(timeout = 30_000): Promise<void> {
        const startedAt = Date.now();
        while (!this.output.includes('Device simulation in progress')) {
            if (this.processHandle.exitCode !== null) {
                const diagnostics = this.diagnostics;
                await this.stop();
                throw new Error(`Azure CLI device simulator exited before connecting.\n${diagnostics}`);
            }
            if (Date.now() - startedAt > timeout) {
                await this.stop();
                throw new Error(`Timed out waiting for the Azure CLI device simulator.\n${this.diagnostics}`);
            }
            await new Promise(resolve => setTimeout(resolve, 100));
        }
    }

    public async waitForExit(timeout = 60_000): Promise<void> {
        let timeoutHandle: NodeJS.Timeout | undefined;
        const timeoutPromise = new Promise<never>((_, reject) => {
            timeoutHandle = setTimeout(
                () => reject(new Error(`Timed out waiting for the Azure CLI device simulator to exit.\n${this.diagnostics}`)),
                timeout
            );
        });
        try {
            const exitCode = await Promise.race([this.exitPromise, timeoutPromise]);
            if (exitCode !== 0) {
                throw new Error(`Azure CLI device simulator exited with code ${exitCode}.\n${this.diagnostics}`);
            }
        } finally {
            clearTimeout(timeoutHandle);
        }
    }

    public async stop(): Promise<void> {
        try {
            if (this.processHandle.exitCode === null) {
                await terminateProcessTree(this.processHandle);
                await this.exitPromise;
            }
        } finally {
            await Promise.all(this.temporaryFiles.map(file => rm(file, { force: true })));
        }
    }
}

export const createDeviceId = (workflow: string): string => {
    const normalizedWorkflow = workflow.toLowerCase().replace(/[^a-z0-9-]/g, '-').slice(0, 24);
    return `e2e-${normalizedWorkflow}-${Date.now().toString(36)}-${randomBytes(3).toString('hex')}`;
};
