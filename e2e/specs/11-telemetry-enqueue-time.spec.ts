import { createDeviceId } from '../fixtures/azureCli';
import { test } from '../fixtures/test';
import { AuthenticationPage } from '../pages/authenticationPage';
import { DeviceDetailsPage } from '../pages/deviceDetailsPage';
import { DeviceListPage } from '../pages/deviceListPage';

test.describe.configure({ timeout: 300_000 });

test('retrieves telemetry sent after a specified enqueue time', async ({
    deviceRegistry,
    environment,
    page,
    simulators,
}) => {
    const deviceId = createDeviceId('enqueue-time');
    const marker = `enqueue-time-${Date.now().toString(36)}`;
    const enqueueTime = new Date();
    enqueueTime.setHours(0, 0, 0, 0);
    deviceRegistry.track(deviceId);

    const authentication = new AuthenticationPage(page);
    const devices = new DeviceListPage(page);
    const details = new DeviceDetailsPage(page);

    await authentication.connectWithConnectionString(environment.connectionString);
    await devices.createDevice(deviceId);
    const simulator = await simulators.start({
        data: marker,
        deviceId,
        messageCount: 3,
        messageIntervalSeconds: 1,
    });
    await simulator.waitForExit();
    await details.startTelemetryFrom(enqueueTime);
    await details.expectTelemetry(marker);
    await details.stopTelemetryMonitoring();
});
