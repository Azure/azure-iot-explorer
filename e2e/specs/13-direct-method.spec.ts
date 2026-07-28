import { createDeviceId } from '../fixtures/azureCli';
import { test } from '../fixtures/test';
import { AuthenticationPage } from '../pages/authenticationPage';
import { DeviceDetailsPage } from '../pages/deviceDetailsPage';
import { DeviceListPage } from '../pages/deviceListPage';

test('invokes a direct method handled by the Azure CLI device simulator', async ({
    deviceRegistry,
    environment,
    page,
    simulators,
}) => {
    const deviceId = createDeviceId('method');
    const methodName = 'e2eMethod';
    const responseMarker = `response-${Date.now().toString(36)}`;
    deviceRegistry.track(deviceId);

    const authentication = new AuthenticationPage(page);
    const devices = new DeviceListPage(page);
    const details = new DeviceDetailsPage(page);

    await authentication.connectWithConnectionString(environment.connectionString);
    await devices.createDevice(deviceId);
    await simulators.start({
        data: 'direct-method-test',
        deviceId,
        messageCount: 120,
        messageIntervalSeconds: 1,
        methodResponseCode: 200,
        methodResponsePayload: JSON.stringify({ result: responseMarker }),
    });

    await details.invokeDirectMethod(methodName, JSON.stringify({ request: 'ping' }));
    await details.expectDirectMethodResponse(responseMarker);
});
