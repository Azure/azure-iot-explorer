import { expect, Page } from '@playwright/test';

export class AuthenticationPage {
    public constructor(private readonly page: Page) {}

    public async connectWithConnectionString(connectionString: string): Promise<void> {
        await expect(this.page.getByRole('heading', { name: /Welcome to Azure IoT Explorer/ })).toBeVisible();
        await this.page.getByRole('button', { name: 'Connect via IoT Hub connection string' }).click();
        await this.page.getByRole('button', { name: 'Add connection string' }).click();
        await this.page.getByLabel('Connection string', { exact: true }).fill(connectionString);
        await this.page.getByRole('button', { name: 'Save connection string' }).click();
        await expect(this.page.getByLabel('Query by device ID')).toBeVisible({ timeout: 60_000 });
    }

    public async expectConnected(): Promise<void> {
        await expect(this.page.getByLabel('Query by device ID')).toBeVisible({ timeout: 60_000 });
    }
}
