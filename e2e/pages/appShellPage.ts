import { expect, Page } from '@playwright/test';

export class AppShellPage {
    public constructor(private readonly page: Page) {}

    public async openSettings(): Promise<void> {
        await this.page.getByRole('button', { name: 'Settings', exact: true }).click();
        await expect(this.page.getByRole('heading', { name: 'Settings', exact: true })).toBeVisible();
    }

    public async useDarkTheme(): Promise<void> {
        const theme = this.page.getByRole('switch', { name: 'Light', exact: true });
        await theme.check();
        await expect(this.page.getByRole('switch', { name: 'Dark', exact: true })).toBeChecked();
    }

    public async expectDarkTheme(): Promise<void> {
        await this.openSettings();
        await expect(this.page.getByRole('switch', { name: 'Dark', exact: true })).toBeChecked();
    }

    public async openModelRepositories(): Promise<void> {
        await this.openSettings();
        const section = this.page.getByRole('region', { name: 'IoT Plug and Play configuration' });
        await section.getByRole('link', { name: 'Please visit Home.' }).click();
        await expect(this.page.getByText('Model Repository Locations:', { exact: true })).toBeVisible();
    }

    public async removePublicRepository(): Promise<void> {
        const repository = this.page.getByRole('listitem').filter({ hasText: 'Public Repository' });
        await repository.getByRole('button', { name: 'Remove', exact: true }).click();
        await this.page.getByRole('button', { name: 'Save', exact: true }).click();
        await expect(repository).toHaveCount(0);
    }

    public async addPublicRepository(): Promise<void> {
        await this.page.getByRole('button', { name: 'Add model source' }).click();
        await this.page.getByRole('menuitem', { name: 'Public repository', exact: true }).click();
        await this.page.getByRole('button', { name: 'Save', exact: true }).click();
        await this.expectPublicRepository();
    }

    public async expectPublicRepository(): Promise<void> {
        await expect(this.page.getByRole('listitem').filter({ hasText: 'Public Repository' })).toBeVisible();
    }

    public async expectNoPublicRepository(): Promise<void> {
        await expect(this.page.getByRole('listitem').filter({ hasText: 'Public Repository' })).toHaveCount(0);
    }

    public async expectDeviceBreadcrumbs(deviceId: string): Promise<void> {
        await expect(this.page.getByRole('link', { name: 'Devices', exact: true })).toBeVisible();
        await expect(this.page.getByText(deviceId, { exact: true }).first()).toBeVisible();
    }

    public async clearNotifications(): Promise<void> {
        await this.page.getByRole('button', { name: 'Notification center', exact: true }).last().click();
        await expect(this.page.getByText('Notification Center', { exact: true }).first()).toBeVisible();
        await this.page.getByRole('button', { name: 'Clear all notifications', exact: true }).click();
        await expect(this.page.getByText('There are no new notifications for this session.', { exact: true })).toBeVisible();
    }
}
