import { createDeviceId } from '../fixtures/azureCli';
import { test } from '../fixtures/test';
import { AuthenticationPage } from '../pages/authenticationPage';
import { DeviceDetailsPage } from '../pages/deviceDetailsPage';
import { DeviceListPage } from '../pages/deviceListPage';

test.describe.configure({ timeout: 300_000 });

test('monitors telemetry through a custom connection to the built-in Event Hub', async ({
    azureCli,
    deviceRegistry,
    environment,
    page,
    simulators,
}) => {
    const deviceId = createDeviceId('custom-eventhub');
    const marker = `custom-eventhub-${Date.now().toString(36)}`;
    const eventHubConnectionString = await azureCli.getBuiltInEventHubConnectionString();
    deviceRegistry.track(deviceId);

    const authentication = new AuthenticationPage(page);
    const devices = new DeviceListPage(page);
    const details = new DeviceDetailsPage(page);

    await authentication.connectWithConnectionString(environment.connectionString);
    await devices.createDevice(deviceId);
    await details.startTelemetryWithCustomEventHub(eventHubConnectionString);
    await simulators.start({
        data: marker,
        deviceId,
        messageCount: 5,
        messageIntervalSeconds: 1,
    });
    await details.expectTelemetry(marker);
    await details.stopTelemetryMonitoring();
});
