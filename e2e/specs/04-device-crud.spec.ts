import { createDeviceId } from '../fixtures/azureCli';
import { test } from '../fixtures/test';
import { AuthenticationPage } from '../pages/authenticationPage';
import { DeviceListPage } from '../pages/deviceListPage';

test.describe.configure({ timeout: 360_000 });

test('creates and deletes a device through the UI', async ({ iotHubRegistry, deviceRegistry, environment, page }) => {
    const deviceId = createDeviceId('crud');
    deviceRegistry.track(deviceId);

    const authentication = new AuthenticationPage(page);
    const devices = new DeviceListPage(page);

    await authentication.connectWithConnectionString(environment.connectionString);
    await devices.createDevice(deviceId);
    await devices.expectDeviceCreated(deviceId);
    await iotHubRegistry.waitForDeviceQueryable(deviceId);
    await devices.returnToDeviceList();
    await devices.deleteDevice(deviceId);
    await devices.expectDeviceDeleted(deviceId);
});
