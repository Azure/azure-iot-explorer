import { createDeviceId } from '../fixtures/azureCli';
import { expect, test } from '../fixtures/test';
import { AuthenticationPage } from '../pages/authenticationPage';
import { DeviceIdentityPage } from '../pages/deviceIdentityPage';
import { DeviceListPage } from '../pages/deviceListPage';

test.describe.configure({ timeout: 360_000 });

test('disables and re-enables a test device', async ({ iotHubRegistry, deviceRegistry, environment, page }) => {
    const deviceId = createDeviceId('status');
    await deviceRegistry.create(deviceId);
    await iotHubRegistry.waitForDeviceQueryable(deviceId);

    const authentication = new AuthenticationPage(page);
    const devices = new DeviceListPage(page);
    const identity = new DeviceIdentityPage(page);

    await authentication.connectWithConnectionString(environment.connectionString);
    await devices.openDevice(deviceId);
    await identity.setConnectivity(false);
    await expect.poll(() => iotHubRegistry.getDeviceStatus(deviceId), { timeout: 60_000 }).toBe('disabled');

    await devices.returnToDeviceList();
    await devices.openDevice(deviceId);
    await identity.setConnectivity(true);
    await expect.poll(() => iotHubRegistry.getDeviceStatus(deviceId), { timeout: 60_000 }).toBe('enabled');
});

test('regenerates only the primary symmetric key', async ({ iotHubRegistry, deviceRegistry, environment, page }) => {
    const deviceId = createDeviceId('key');
    await deviceRegistry.create(deviceId);
    await iotHubRegistry.waitForDeviceQueryable(deviceId);
    const originalKeys = await iotHubRegistry.getDeviceKeys(deviceId);

    const authentication = new AuthenticationPage(page);
    const devices = new DeviceListPage(page);
    const identity = new DeviceIdentityPage(page);

    await authentication.connectWithConnectionString(environment.connectionString);
    await devices.openDevice(deviceId);
    await identity.regeneratePrimaryKey();

    await expect.poll(async () => {
        const updatedKeys = await iotHubRegistry.getDeviceKeys(deviceId);
        return updatedKeys.primaryKey !== originalKeys.primaryKey;
    }, { timeout: 60_000 }).toBe(true);
    const updatedKeys = await iotHubRegistry.getDeviceKeys(deviceId);
    expect(updatedKeys.secondaryKey === originalKeys.secondaryKey).toBe(true);
});
