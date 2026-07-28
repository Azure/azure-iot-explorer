import { expect, Page } from '@playwright/test';

export class DeviceIdentityPage {
    public constructor(private readonly page: Page) {}

    public async setConnectivity(enabled: boolean): Promise<void> {
        const connectivity = this.page.getByRole('switch', { name: 'Connect this device to IoT hub' });
        if (await connectivity.isChecked() !== enabled) {
            await connectivity.click();
        }
        await this.save();
    }

    public async regeneratePrimaryKey(): Promise<void> {
        await this.page.getByRole('button', { name: 'Manage keys for device' }).click();
        await this.page.getByRole('menuitem', { name: 'Regenerate primary key' }).click();
        await expect(
            this.page.getByRole('status').filter({ hasText: 'Primary key generated' })
        ).toBeVisible();
        await this.save();
    }

    private async save(): Promise<void> {
        const save = this.page.getByRole('button', { name: 'Save', exact: true });
        await expect(save).toBeEnabled();
        await save.click();
    }
}
