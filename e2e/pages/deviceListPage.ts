import { expect, Page } from '@playwright/test';

export class DeviceListPage {
    public constructor(private readonly page: Page) {}

    public async createDevice(deviceId: string): Promise<void> {
        await this.page.getByRole('button', { name: 'New', exact: true }).click();
        await this.page.getByLabel('Device ID', { exact: true }).fill(deviceId);
        await this.page.getByRole('button', { name: 'Create', exact: true }).click();
        await this.page.getByLabel('Device ID', { exact: true }).waitFor({ state: 'visible', timeout: 60_000 });
    }

    public async expectDeviceCreated(deviceId: string): Promise<void> {
        await expect(this.page.getByLabel('Device ID', { exact: true })).toHaveValue(deviceId, { timeout: 60_000 });
    }

    public async returnToDeviceList(): Promise<void> {
        await this.page.getByRole('link', { name: 'Devices', exact: true }).click();
        await expect(this.page.getByLabel('Query by device ID')).toBeVisible();
    }

    public async findDevice(deviceId: string): Promise<void> {
        const query = this.page.getByLabel('Query by device ID');
        await query.fill(deviceId);
        const search = this.page.getByRole('button', { name: /Execute Search by device id/ });
        const addDevice = this.page.getByRole('button', { name: 'New', exact: true });
        const deviceLink = this.page.getByRole('link', { name: deviceId, exact: true });
        const deadline = Date.now() + 60_000;

        while (Date.now() < deadline) {
            await expect(search).toBeEnabled();
            await search.click();
            await expect(addDevice).toBeEnabled({ timeout: 45_000 });
            if (await deviceLink.count() === 1) {
                return;
            }
        }

        throw new Error(`Device ${deviceId} did not appear in the device list.`);
    }

    public async searchByDeviceId(deviceId: string): Promise<void> {
        const query = this.page.getByLabel('Query by device ID');
        await query.fill(deviceId);
        await this.page.getByRole('button', { name: /Execute Search by device id/ }).click();
        await expect(this.page.getByRole('button', { name: 'New', exact: true })).toBeEnabled({ timeout: 45_000 });
    }

    public async filterByStatus(status: 'Disabled' | 'Enabled'): Promise<void> {
        await this.page.getByRole('button', { name: 'Add query parameter' }).click();
        await this.page.getByLabel('Type of query clause').click();
        await this.page.getByRole('option', { name: 'Status', exact: true }).click();
        await this.page.getByLabel('Select value').click();
        await this.page.getByRole('option', { name: status, exact: true }).click();
        await this.page.getByRole('button', { name: 'Execute search with specified clauses and without device Id.' }).click();
        await expect(this.page.getByRole('button', { name: 'New', exact: true })).toBeEnabled({ timeout: 45_000 });
    }

    public async deleteDevices(deviceIds: string[]): Promise<void> {
        for (const deviceId of deviceIds) {
            const deviceRow = this.page
                .getByRole('row')
                .filter({ has: this.page.getByRole('link', { name: deviceId, exact: true }) });
            await deviceRow.getByRole('checkbox').check();
        }
        await this.page.getByRole('button', { name: 'Delete', exact: true }).click();
        const dialog = this.page.getByRole('alertdialog', { name: 'Delete from IoT Hub?' });
        for (const deviceId of deviceIds) {
            await expect(dialog.getByText(deviceId, { exact: true })).toBeVisible();
        }
        await dialog.getByRole('button', { name: 'Delete', exact: true }).click();
    }

    public async expectDeviceVisible(deviceId: string): Promise<void> {
        await expect(this.page.getByRole('link', { name: deviceId, exact: true })).toBeVisible({ timeout: 60_000 });
    }

    public async expectDeviceNotVisible(deviceId: string): Promise<void> {
        await expect(this.page.getByRole('link', { name: deviceId, exact: true })).toHaveCount(0, { timeout: 60_000 });
    }

    public async openDevice(deviceId: string): Promise<void> {
        await this.findDevice(deviceId);
        await this.page.getByRole('link', { name: deviceId, exact: true }).click();
        await expect(this.page.getByLabel('Device ID', { exact: true })).toHaveValue(deviceId, { timeout: 60_000 });
    }

    public async deleteDevice(deviceId: string): Promise<void> {
        await this.findDevice(deviceId);
        const deviceRow = this.page
            .getByRole('row')
            .filter({ has: this.page.getByRole('link', { name: deviceId, exact: true }) });
        await deviceRow.getByRole('checkbox').check();
        await this.page.getByRole('button', { name: 'Delete', exact: true }).click();

        const dialog = this.page.getByRole('alertdialog', { name: 'Delete from IoT Hub?' });
        await expect(dialog).toContainText(deviceId);
        await dialog.getByRole('button', { name: 'Delete', exact: true }).click();
    }

    public async expectDeviceDeleted(deviceId: string): Promise<void> {
        await expect(this.page.getByRole('link', { name: deviceId, exact: true })).toHaveCount(0, { timeout: 60_000 });
    }
}
