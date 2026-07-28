import { expect, Page } from '@playwright/test';

export class SavedConnectionsPage {
    public constructor(private readonly page: Page) {}

    public async openFromWelcome(): Promise<void> {
        await this.page.getByRole('button', { name: 'Connect via IoT Hub connection string' }).click();
        await expect(this.page.getByRole('button', { name: 'Add connection string' })).toBeVisible();
    }

    public async returnHome(): Promise<void> {
        await this.page.getByRole('link', { name: 'Home', exact: true }).click();
        await expect(this.page.getByRole('button', { name: 'Add connection string' })).toBeVisible();
    }

    public async add(connectionString: string): Promise<void> {
        await this.page.getByRole('button', { name: 'Add connection string' }).click();
        await this.page.getByLabel('Connection string', { exact: true }).fill(connectionString);
        await this.page.getByRole('button', { name: 'Save connection string' }).click();
    }

    public async openAddForm(): Promise<void> {
        await this.page.getByRole('button', { name: 'Add connection string' }).click();
        await expect(this.page.getByRole('heading', { name: 'Add connection string' })).toBeVisible();
    }

    public async enterConnectionString(connectionString: string): Promise<void> {
        await this.page.getByLabel('Connection string', { exact: true }).fill(connectionString);
    }

    public async expectSaveDisabled(): Promise<void> {
        await expect(this.page.getByRole('button', { name: 'Save connection string' })).toBeDisabled();
    }

    public async select(resourceName: string): Promise<void> {
        await this.page.getByRole('button', { name: resourceName, exact: true }).click();
    }

    public async delete(resourceName: string): Promise<void> {
        await expect(this.page.getByRole('button', { name: resourceName, exact: true })).toBeVisible();
        await this.page.getByRole('button', { name: /^Delete connection string / }).click();
        const dialog = this.page.getByRole('alertdialog', { name: 'Confirm Delete' });
        await expect(dialog).toBeVisible();
        await dialog.getByRole('button', { name: /^Yes, delete / }).click();
    }

    public async expectSaved(resourceName: string): Promise<void> {
        await expect(this.page.getByRole('button', { name: resourceName, exact: true })).toBeVisible();
    }

    public async expectNotSaved(resourceName: string): Promise<void> {
        await expect(this.page.getByRole('button', { name: resourceName, exact: true })).toHaveCount(0);
    }
}
