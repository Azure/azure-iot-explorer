import { createDeviceId } from '../fixtures/azureCli';
import { test } from '../fixtures/test';
import { AuthenticationPage } from '../pages/authenticationPage';
import { DeviceDetailsPage } from '../pages/deviceDetailsPage';
import { DeviceListPage } from '../pages/deviceListPage';

test('updates and reloads a desired twin property', async ({ deviceRegistry, environment, page }) => {
    const deviceId = createDeviceId('twin');
    const propertyName = 'e2eMarker';
    const propertyValue = `twin-${Date.now().toString(36)}`;
    deviceRegistry.track(deviceId);

    const authentication = new AuthenticationPage(page);
    const devices = new DeviceListPage(page);
    const details = new DeviceDetailsPage(page);

    await authentication.connectWithConnectionString(environment.connectionString);
    await devices.createDevice(deviceId);
    await details.updateTwin(deviceId, propertyName, propertyValue);
    await details.refreshTwin();
    await details.expectTwinProperty(propertyName, propertyValue);
});
