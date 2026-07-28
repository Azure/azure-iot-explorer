import { createDeviceId } from '../fixtures/azureCli';
import { test } from '../fixtures/test';
import { AuthenticationPage } from '../pages/authenticationPage';
import { DeviceDetailsPage } from '../pages/deviceDetailsPage';
import { DeviceListPage } from '../pages/deviceListPage';

test('sends a cloud-to-device message to the IoT Hub queue', async ({
    deviceRegistry,
    environment,
    page,
}) => {
    const deviceId = createDeviceId('c2d-send');
    const message = `c2d-${Date.now().toString(36)}`;
    deviceRegistry.track(deviceId);

    const authentication = new AuthenticationPage(page);
    const devices = new DeviceListPage(page);
    const details = new DeviceDetailsPage(page);

    await authentication.connectWithConnectionString(environment.connectionString);
    await devices.createDevice(deviceId);
    await details.sendCloudToDeviceMessage(deviceId, message);
});
