import { createDeviceId } from '../fixtures/azureCli';
import { expect, test } from '../fixtures/test';
import { AuthenticationPage } from '../pages/authenticationPage';
import { DeviceListPage } from '../pages/deviceListPage';
import { ModuleIdentityPage } from '../pages/moduleIdentityPage';

test.describe.configure({ timeout: 420_000 });

test('creates, updates, and deletes a module identity', async ({
    deviceRegistry,
    environment,
    iotHubRegistry,
    moduleRegistry,
    page,
}) => {
    const deviceId = createDeviceId('module-parent');
    const moduleId = createDeviceId('module').replace(/^e2e-/, '');
    const propertyName = 'e2eMarker';
    const propertyValue = `module-${Date.now().toString(36)}`;
    await deviceRegistry.create(deviceId);
    await iotHubRegistry.waitForDeviceQueryable(deviceId);
    moduleRegistry.track(deviceId, moduleId);

    const authentication = new AuthenticationPage(page);
    const devices = new DeviceListPage(page);
    const modules = new ModuleIdentityPage(page);

    await authentication.connectWithConnectionString(environment.connectionString);
    await devices.openDevice(deviceId);
    await modules.openList();
    await modules.create(moduleId);
    await expect.poll(() => iotHubRegistry.moduleExists(deviceId, moduleId), { timeout: 60_000 }).toBe(true);
    await iotHubRegistry.waitForModuleQueryable(deviceId, moduleId);
    await modules.expectListed(moduleId);
    await modules.open(moduleId);
    await modules.updateTwin(deviceId, moduleId, propertyName, propertyValue);
    await modules.delete();
    await modules.expectNotListed(moduleId);
    await expect.poll(() => iotHubRegistry.moduleExists(deviceId, moduleId), { timeout: 60_000 }).toBe(false);
});
