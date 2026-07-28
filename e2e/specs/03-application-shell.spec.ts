import { createDeviceId } from '../fixtures/azureCli';
import { test } from '../fixtures/test';
import { AppShellPage } from '../pages/appShellPage';
import { AuthenticationPage } from '../pages/authenticationPage';
import { DeviceListPage } from '../pages/deviceListPage';

test('persists the selected theme across an Electron relaunch', async ({ electronSession }) => {
    const shell = new AppShellPage(electronSession.page);
    await shell.openSettings();
    await shell.useDarkTheme();

    const relaunchedPage = await electronSession.relaunch();
    await new AppShellPage(relaunchedPage).expectDarkTheme();
});

test('persists public model-repository removal and restoration', async ({ electronSession }) => {
    let shell = new AppShellPage(electronSession.page);
    await shell.openModelRepositories();
    await shell.removePublicRepository();

    let relaunchedPage = await electronSession.relaunch();
    shell = new AppShellPage(relaunchedPage);
    await shell.openModelRepositories();
    await shell.expectNoPublicRepository();
    await shell.addPublicRepository();

    relaunchedPage = await electronSession.relaunch();
    shell = new AppShellPage(relaunchedPage);
    await shell.openModelRepositories();
    await shell.expectPublicRepository();
});

test('shows device breadcrumbs and clears session notifications', async ({
    deviceRegistry,
    environment,
    page,
}) => {
    const deviceId = createDeviceId('shell');
    deviceRegistry.track(deviceId);

    const authentication = new AuthenticationPage(page);
    const devices = new DeviceListPage(page);
    const shell = new AppShellPage(page);

    await authentication.connectWithConnectionString(environment.connectionString);
    await devices.createDevice(deviceId);
    await shell.expectDeviceBreadcrumbs(deviceId);
    await shell.clearNotifications();
});
