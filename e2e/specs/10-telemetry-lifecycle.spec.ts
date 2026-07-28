import { createDeviceId } from '../fixtures/azureCli';
import { test } from '../fixtures/test';
import { AuthenticationPage } from '../pages/authenticationPage';
import { DeviceDetailsPage } from '../pages/deviceDetailsPage';
import { DeviceListPage } from '../pages/deviceListPage';

test.describe.configure({ timeout: 300_000 });

test('stops, restarts, and shows system properties while monitoring telemetry', async ({
    deviceRegistry,
    environment,
    page,
    simulators,
}) => {
    const deviceId = createDeviceId('telemetry-lifecycle');
    const initialMarker = `initial-${Date.now().toString(36)}`;
    const stoppedMarker = `stopped-${Date.now().toString(36)}`;
    const restartedMarker = `restarted-${Date.now().toString(36)}`;
    deviceRegistry.track(deviceId);

    const authentication = new AuthenticationPage(page);
    const devices = new DeviceListPage(page);
    const details = new DeviceDetailsPage(page);

    await authentication.connectWithConnectionString(environment.connectionString);
    await devices.createDevice(deviceId);
    await details.startTelemetryMonitoring();

    const initialSimulator = await simulators.start({
        data: initialMarker,
        deviceId,
        messageCount: 3,
        messageIntervalSeconds: 1,
    });
    await details.expectTelemetry(initialMarker);
    await initialSimulator.waitForExit();
    await details.stopTelemetryMonitoring();

    const stoppedSimulator = await simulators.start({
        data: stoppedMarker,
        deviceId,
        messageCount: 3,
        messageIntervalSeconds: 1,
    });
    await stoppedSimulator.waitForExit();
    await details.expectTelemetryNotVisible(stoppedMarker);

    await details.startTelemetryMonitoring();
    await details.showSystemProperties();
    const restartedSimulator = await simulators.start({
        data: restartedMarker,
        deviceId,
        messageCount: 3,
        messageIntervalSeconds: 1,
    });
    await details.expectTelemetry(restartedMarker);
    await details.expectTelemetrySystemProperties(restartedMarker);
    await restartedSimulator.waitForExit();
    await details.stopTelemetryMonitoring();
});
