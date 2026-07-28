import { bootstrapE2E, E2EContext } from '../fixtures/bootstrap.ts';
import { redactSecrets } from '../fixtures/environment.ts';
import { IoTHubRegistry } from '../fixtures/iotHubRegistry.ts';

let context: E2EContext | undefined;

const main = async (): Promise<void> => {
    context = await bootstrapE2E();
    const iotHubRegistry = new IoTHubRegistry(context.environment);
    const deletedDevices = await iotHubRegistry.cleanupDevicesByPrefix('e2e-');
    process.stdout.write(`Deleted ${deletedDevices.length} E2E device(s).\n`);
};

main().catch(error => {
    const message = error instanceof Error ? error.stack || error.message : String(error);
    process.stderr.write(`${redactSecrets(message, context?.environment)}\n`);
    process.exitCode = 1;
});
