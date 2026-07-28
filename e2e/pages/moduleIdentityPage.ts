import { expect, Page } from '@playwright/test';

export class ModuleIdentityPage {
    public constructor(private readonly page: Page) {}

    public async openList(): Promise<void> {
        await this.page.getByRole('tab', { name: 'Module identities' }).click();
        await expect(this.page.getByRole('button', { name: 'Add', exact: true })).toBeVisible({ timeout: 60_000 });
    }

    public async create(moduleId: string): Promise<void> {
        await this.page.getByRole('button', { name: 'Add', exact: true }).click();
        await this.page.getByLabel('Module identity name').fill(moduleId);
        await this.page.getByRole('button', { name: 'Create', exact: true }).click();
        await expect(
            this.page.getByRole('status').filter({ hasText: `Successfully added module identity ${moduleId}` })
        ).toBeVisible({ timeout: 60_000 });
    }

    public async expectListed(moduleId: string): Promise<void> {
        await this.page.getByRole('button', { name: 'Refresh', exact: true }).click();
        await expect(this.page.getByRole('link', { name: moduleId, exact: true })).toBeVisible({ timeout: 60_000 });
    }

    public async open(moduleId: string): Promise<void> {
        await this.page.getByRole('link', { name: moduleId, exact: true }).click();
        await expect(this.page.getByLabel('Module identity name')).toHaveValue(moduleId, { timeout: 60_000 });
    }

    public async updateTwin(deviceId: string, moduleId: string, propertyName: string, propertyValue: string): Promise<void> {
        await this.page.getByRole('tab', { name: 'Module twin', exact: true }).click();
        const editor = this.page.getByTestId('module-twin-editor');
        await expect(editor.getByRole('textbox')).toBeVisible({ timeout: 60_000 });
        const twin = JSON.stringify({
            deviceId,
            moduleId,
            properties: {
                desired: {
                    [propertyName]: propertyValue,
                },
            },
        }, null, 2);
        await editor.evaluate((element, value) => {
            element.dispatchEvent(new CustomEvent('e2e:set-value', { detail: value }));
        }, twin);
        const save = this.page.getByRole('button', { name: 'Save', exact: true });
        await expect(save).toBeEnabled();
        await save.click();
        await expect(
            this.page.getByRole('status').filter({ hasText: `Successfully updated module identity twin for module ${moduleId}` })
        ).toBeVisible({ timeout: 60_000 });
        await this.page.getByRole('button', { name: 'Refresh', exact: true }).click();
        await expect(
            editor.getByText(`"${propertyName}": "${propertyValue}"`, { exact: false })
        ).toBeVisible({ timeout: 60_000 });
    }

    public async delete(): Promise<void> {
        await this.page.getByRole('tab', { name: 'Module detail', exact: true }).click();
        await this.page.getByRole('button', { name: 'Delete', exact: true }).click();
        const dialog = this.page.getByRole('alertdialog', { name: 'Are you certain you wish to delete this module identity?' });
        await dialog.getByRole('button', { name: 'Delete', exact: true }).click();
    }

    public async expectNotListed(moduleId: string): Promise<void> {
        await expect(this.page.getByRole('link', { name: moduleId, exact: true })).toHaveCount(0, { timeout: 60_000 });
    }
}
