import { test } from '../fixtures/test';
import { AuthenticationPage } from '../pages/authenticationPage';
import { SavedConnectionsPage } from '../pages/savedConnectionsPage';

const resourceNameFromHub = (hubName: string): string => hubName.replace(/\.azure-devices\.net$/i, '');

test('rejects a malformed connection string before saving', async ({ page }) => {
    const savedConnections = new SavedConnectionsPage(page);

    await savedConnections.openFromWelcome();
    await savedConnections.openAddForm();
    await savedConnections.enterConnectionString('HostName=invalid.azure-devices.net;InvalidKey=value');
    await savedConnections.expectSaveDisabled();
});

test('persists and reopens a saved connection after relaunch', async ({ electronSession, environment }) => {
    const resourceName = resourceNameFromHub(environment.hubName);
    let page = electronSession.page;
    let authentication = new AuthenticationPage(page);
    let savedConnections = new SavedConnectionsPage(page);

    await authentication.connectWithConnectionString(environment.connectionString);
    await savedConnections.returnHome();
    await savedConnections.expectSaved(resourceName);

    page = await electronSession.relaunch();
    authentication = new AuthenticationPage(page);
    savedConnections = new SavedConnectionsPage(page);

    await savedConnections.expectSaved(resourceName);
    await savedConnections.select(resourceName);
    await authentication.expectConnected();
});

test('deletes a saved connection', async ({ environment, page }) => {
    const resourceName = resourceNameFromHub(environment.hubName);
    const authentication = new AuthenticationPage(page);
    const savedConnections = new SavedConnectionsPage(page);

    await authentication.connectWithConnectionString(environment.connectionString);
    await savedConnections.returnHome();
    await savedConnections.delete(resourceName);
    await savedConnections.expectNotSaved(resourceName);
});
