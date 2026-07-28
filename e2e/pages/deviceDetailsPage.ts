import { expect, Page } from '@playwright/test';

export class DeviceDetailsPage {
    public constructor(private readonly page: Page) {}

    public async updateTwin(deviceId: string, propertyName: string, propertyValue: string): Promise<void> {
        await this.page.getByRole('tab', { name: 'Device twin' }).click();
        const editorRegion = this.page.getByTestId('device-twin-editor');
        const editor = editorRegion.getByRole('textbox');
        await expect(editor).toBeVisible({ timeout: 60_000 });
        const updatedTwin = JSON.stringify({
            deviceId,
            properties: {
                desired: {
                    [propertyName]: propertyValue,
                },
            },
        }, null, 2);
        await this.page.getByTestId('device-twin-editor').evaluate((element, value) => {
            element.dispatchEvent(new CustomEvent('e2e:set-value', { detail: value }));
        }, updatedTwin);
        const save = this.page.getByRole('button', { name: 'Save', exact: true });
        await expect(save).toBeEnabled();
        await save.click();
        await expect(
            this.page.getByRole('status').getByText(`Successfully updated device twin on device ${deviceId}.`, { exact: true })
        ).toBeVisible({ timeout: 60_000 });
    }

    public async refreshTwin(): Promise<void> {
        await this.page.getByRole('button', { name: 'Refresh', exact: true }).click();
    }

    public async expectTwinProperty(propertyName: string, propertyValue: string): Promise<void> {
        await expect(
            this.page.getByTestId('device-twin-editor').getByText(`"${propertyName}": "${propertyValue}"`, { exact: false })
        ).toBeVisible({ timeout: 60_000 });
    }

    public async startTelemetryMonitoring(): Promise<void> {
        await this.page.getByRole('tab', { name: 'Telemetry' }).click();
        await this.startTelemetry();
    }

    public async startTelemetryWithCustomEventHub(connectionString: string): Promise<void> {
        await this.page.getByRole('tab', { name: 'Telemetry' }).click();
        await this.page.getByRole('switch', { name: 'Use built-in event hub' }).uncheck();
        await this.page.getByLabel('Custom event hub connection string', { exact: true }).fill(connectionString);
        await this.startTelemetry();
    }

    public async startTelemetryFrom(enqueueTime: Date): Promise<void> {
        await this.page.getByRole('tab', { name: 'Telemetry' }).click();
        await this.page.getByRole('switch', { name: 'Specify enqueue time' }).check();
        const hour = enqueueTime.getHours() % 12 || 12;
        const minutes = enqueueTime.getMinutes().toString().padStart(2, '0');
        const period = enqueueTime.getHours() >= 12 ? 'PM' : 'AM';
        const time = this.page.getByRole('combobox', { name: 'Start time - time' });
        await time.fill(`${hour}:${minutes} ${period}`);
        await time.press('Enter');
        await this.startTelemetry();
    }

    private async startTelemetry(): Promise<void> {
        await this.page.getByRole('button', { name: 'Start', exact: true }).click();
        await expect(this.page.getByRole('button', { name: 'Stop', exact: true })).toBeVisible({ timeout: 60_000 });
    }

    public async expectTelemetry(marker: string): Promise<void> {
        await expect(this.page.getByRole('article').filter({ hasText: marker }).first()).toBeVisible({ timeout: 60_000 });
    }

    public async expectTelemetryNotVisible(marker: string): Promise<void> {
        await expect(this.page.getByRole('article').filter({ hasText: marker })).toHaveCount(0);
    }

    public async showSystemProperties(): Promise<void> {
        await this.page.getByRole('checkbox', { name: 'Show system properties' }).check();
    }

    public async expectTelemetrySystemProperties(marker: string): Promise<void> {
        await expect(
            this.page.getByRole('article').filter({ hasText: marker }).filter({ hasText: '"systemProperties"' }).first()
        ).toBeVisible({ timeout: 60_000 });
    }

    public async stopTelemetryMonitoring(): Promise<void> {
        await this.page.getByRole('button', { name: 'Stop', exact: true }).click();
        await expect(this.page.getByRole('button', { name: 'Start', exact: true })).toBeVisible();
    }

    public async invokeDirectMethod(methodName: string, payload: string): Promise<void> {
        await this.page.getByRole('tab', { name: 'Direct method' }).click();
        await this.page.getByLabel('Method name').fill(methodName);
        await this.page.getByLabel('Payload', { exact: true }).fill(payload);
        await this.page.getByRole('button', { name: 'Invoke method', exact: true }).click();
    }

    public async expectDirectMethodResponse(expectedResponse: string): Promise<void> {
        const success = this.page
            .getByRole('status')
            .filter({ hasText: 'Successfully invoked method' })
            .filter({ hasText: expectedResponse })
            .last();
        await expect(success).toBeVisible({ timeout: 60_000 });
    }

    public async expectDirectMethodError(deviceId: string): Promise<void> {
        await expect(
            this.page.getByRole('status').filter({ hasText: `Failed to invoke method on device ${deviceId}` }).last()
        ).toBeVisible({ timeout: 60_000 });
    }

    public async sendCloudToDeviceMessage(deviceId: string, message: string): Promise<void> {
        await this.page.getByRole('tab', { name: 'Cloud-to-device message' }).click();
        await this.page.getByLabel('Message body', { exact: true }).fill(message);
        await this.page.getByRole('button', { name: 'Send message to device', exact: true }).click();
        await expect(
            this.page.getByRole('status')
                .filter({ hasText: `Successfully send message '${message}' to device '${deviceId}'` })
                .last()
        ).toBeVisible({ timeout: 60_000 });
    }
}
