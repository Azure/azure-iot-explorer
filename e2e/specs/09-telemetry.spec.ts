import { createDeviceId } from '../fixtures/azureCli';
import { test } from '../fixtures/test';
import { AuthenticationPage } from '../pages/authenticationPage';
import { DeviceDetailsPage } from '../pages/deviceDetailsPage';
import { DeviceListPage } from '../pages/deviceListPage';

test('shows telemetry emitted by the Azure CLI device simulator', async ({
    deviceRegistry,
    environment,
    page,
    simulators,
}) => {
    const deviceId = createDeviceId('telemetry');
    const marker = `telemetry-${Date.now().toString(36)}`;
    deviceRegistry.track(deviceId);

    const authentication = new AuthenticationPage(page);
    const devices = new DeviceListPage(page);
    const details = new DeviceDetailsPage(page);

    await authentication.connectWithConnectionString(environment.connectionString);
    await devices.createDevice(deviceId);
    await details.startTelemetryMonitoring();

    await simulators.start({
        data: marker,
        deviceId,
        messageCount: 10,
        messageIntervalSeconds: 1,
    });

    await details.expectTelemetry(marker);
    await details.stopTelemetryMonitoring();
});
