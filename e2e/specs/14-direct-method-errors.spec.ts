import { createDeviceId } from '../fixtures/azureCli';
import { test } from '../fixtures/test';
import { AuthenticationPage } from '../pages/authenticationPage';
import { DeviceDetailsPage } from '../pages/deviceDetailsPage';
import { DeviceListPage } from '../pages/deviceListPage';

test.describe.configure({ timeout: 240_000 });

test('reports an offline method error and preserves a nested simulator response', async ({
    deviceRegistry,
    environment,
    page,
    simulators,
}) => {
    const deviceId = createDeviceId('method-errors');
    const methodName = 'e2eMethod';
    const nestedMarker = `nested-${Date.now().toString(36)}`;
    deviceRegistry.track(deviceId);

    const authentication = new AuthenticationPage(page);
    const devices = new DeviceListPage(page);
    const details = new DeviceDetailsPage(page);

    await authentication.connectWithConnectionString(environment.connectionString);
    await devices.createDevice(deviceId);
    await details.invokeDirectMethod(methodName, JSON.stringify({ request: 'offline' }));
    await details.expectDirectMethodError(deviceId);

    await simulators.start({
        data: 'direct-method-resilience',
        deviceId,
        messageCount: 120,
        messageIntervalSeconds: 1,
        methodResponseCode: 200,
        methodResponsePayload: JSON.stringify({ result: { marker: nestedMarker, values: [1, 2, 3] } }),
    });
    await details.invokeDirectMethod(methodName, JSON.stringify({ request: { nested: true } }));
    await details.expectDirectMethodResponse(nestedMarker);
});
