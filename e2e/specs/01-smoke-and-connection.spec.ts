import { AuthenticationPage } from '../pages/authenticationPage';
import { expect, test } from '../fixtures/test';

test('launches the Electron application', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /Welcome to Azure IoT Explorer/ })).toBeVisible();
});

test('connects to the configured IoT Hub with a connection string', async ({ environment, page }) => {
    const authentication = new AuthenticationPage(page);
    await authentication.connectWithConnectionString(environment.connectionString);
    await authentication.expectConnected();
});
