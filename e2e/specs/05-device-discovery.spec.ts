import { createDeviceId } from '../fixtures/azureCli';
import { expect, test } from '../fixtures/test';
import { AuthenticationPage } from '../pages/authenticationPage';
import { DeviceListPage } from '../pages/deviceListPage';

test.describe.configure({ timeout: 360_000 });

test('filters the real device list by status', async ({ iotHubRegistry, deviceRegistry, environment, page }) => {
    const enabledDeviceId = createDeviceId('query-enabled');
    const disabledDeviceId = createDeviceId('query-disabled');
    await deviceRegistry.create(enabledDeviceId, { status: 'enabled' });
    await deviceRegistry.create(disabledDeviceId, { status: 'disabled' });
    await iotHubRegistry.waitForDeviceQueryable(enabledDeviceId);
    await iotHubRegistry.waitForDeviceQueryable(disabledDeviceId);
    expect(await iotHubRegistry.getDeviceStatus(disabledDeviceId)).toBe('disabled');

    const authentication = new AuthenticationPage(page);
    const devices = new DeviceListPage(page);

    await authentication.connectWithConnectionString(environment.connectionString);
    await devices.filterByStatus('Disabled');
    await devices.expectDeviceVisible(disabledDeviceId);
    await devices.expectDeviceNotVisible(enabledDeviceId);
});

test('bulk deletes only the selected test devices', async ({ iotHubRegistry, deviceRegistry, environment, page }) => {
    const commonPrefix = createDeviceId('bulk');
    const deviceIds = [`${commonPrefix}-a`, `${commonPrefix}-b`];
    const unselectedDeviceId = `${commonPrefix}-control`;
    for (const deviceId of [...deviceIds, unselectedDeviceId]) {
        await deviceRegistry.create(deviceId);
        await iotHubRegistry.waitForDeviceQueryable(deviceId);
    }

    const authentication = new AuthenticationPage(page);
    const devices = new DeviceListPage(page);

    await authentication.connectWithConnectionString(environment.connectionString);
    await devices.searchByDeviceId(commonPrefix);
    for (const deviceId of [...deviceIds, unselectedDeviceId]) {
        await devices.expectDeviceVisible(deviceId);
    }
    await devices.deleteDevices(deviceIds);
    for (const deviceId of deviceIds) {
        await devices.expectDeviceNotVisible(deviceId);
    }
    await devices.expectDeviceVisible(unselectedDeviceId);
    expect(await iotHubRegistry.getDeviceStatus(unselectedDeviceId)).toBe('enabled');
});
