import { Device, Registry } from 'azure-iothub';
import type { E2EEnvironment } from './environment.ts';
import { redactSecrets } from './environment.ts';

export interface CreateDeviceOptions {
    status?: Device.DeviceStatus;
}

export interface DeviceKeys {
    primaryKey: string;
    secondaryKey: string;
}

interface QueryResult {
    deviceId?: string;
    moduleId?: string;
}

const PREFIX_PATTERN = /^e2e-[a-z0-9-]*$/;

const escapeQueryValue = (value: string): string => value.replaceAll('\'', '\'\'');

const errorProperty = (error: unknown, property: string): unknown => {
    if (typeof error !== 'object' || error === null) {
        return undefined;
    }
    return Reflect.get(error, property);
};

const isNotFoundError = (error: unknown): boolean => {
    const response = errorProperty(error, 'response');
    const responseStatusCode = errorProperty(response, 'statusCode');
    return errorProperty(error, 'statusCode') === 404 ||
        responseStatusCode === 404 ||
        errorProperty(error, 'code') === 'DeviceNotFound';
};

const errorMessage = (error: unknown): string => error instanceof Error ? error.message : String(error);

export class IoTHubRegistry {
    private readonly environment: E2EEnvironment;
    private readonly registry: Registry;

    public constructor(environment: E2EEnvironment) {
        this.environment = environment;
        this.registry = Registry.fromConnectionString(environment.connectionString);
    }

    public async createDevice(deviceId: string, options: CreateDeviceOptions = {}): Promise<void> {
        await this.execute(
            () => this.registry.create({ deviceId, ...(options.status ? { status: options.status } : {}) }),
            `Failed to create E2E device ${deviceId}.`
        );
    }

    public async getDeviceStatus(deviceId: string): Promise<Device.DeviceStatus> {
        const result = await this.execute(
            () => this.registry.get(deviceId),
            `Failed to get E2E device ${deviceId}.`
        );
        if (!result.responseBody.status) {
            throw new Error(`Device ${deviceId} did not return a status.`);
        }
        return result.responseBody.status;
    }

    public async getDeviceKeys(deviceId: string): Promise<DeviceKeys> {
        const result = await this.execute(
            () => this.registry.get(deviceId),
            `Failed to get E2E device ${deviceId}.`
        );
        const keys = result.responseBody.authentication?.symmetricKey;
        if (!keys?.primaryKey || !keys.secondaryKey) {
            throw new Error(`Device ${deviceId} did not return both symmetric keys.`);
        }
        return {
            primaryKey: keys.primaryKey,
            secondaryKey: keys.secondaryKey,
        };
    }

    public async deleteDevice(deviceId: string): Promise<void> {
        try {
            await this.registry.delete(deviceId);
        } catch (error) {
            if (!isNotFoundError(error)) {
                throw this.operationError(`Failed to delete E2E device ${deviceId}.`, error);
            }
        }
    }

    public async deleteModule(deviceId: string, moduleId: string): Promise<void> {
        try {
            await this.registry.removeModule(deviceId, moduleId);
        } catch (error) {
            if (!isNotFoundError(error)) {
                throw this.operationError(`Failed to delete E2E module ${deviceId}/${moduleId}.`, error);
            }
        }
    }

    public async moduleExists(deviceId: string, moduleId: string): Promise<boolean> {
        try {
            await this.registry.getModule(deviceId, moduleId);
            return true;
        } catch (error) {
            if (isNotFoundError(error)) {
                return false;
            }
            throw this.operationError(`Failed to query E2E module ${deviceId}/${moduleId}.`, error);
        }
    }

    public async listDevicesByPrefix(prefix: string): Promise<string[]> {
        if (!PREFIX_PATTERN.test(prefix)) {
            throw new Error('Cleanup prefixes must start with e2e- and contain only lowercase letters, numbers, and hyphens.');
        }

        const results = await this.queryAll(
            `SELECT deviceId FROM devices WHERE STARTSWITH(deviceId, '${escapeQueryValue(prefix)}')`
        );
        return results
            .map(result => result.deviceId)
            .filter((deviceId): deviceId is string => typeof deviceId === 'string');
    }

    public async cleanupDevicesByPrefix(prefix: string): Promise<string[]> {
        const devices = await this.listDevicesByPrefix(prefix);
        for (const deviceId of devices) {
            await this.deleteDevice(deviceId);
        }
        return devices;
    }

    public async waitForDeviceQueryable(deviceId: string, timeout = 240_000): Promise<void> {
        const query = `SELECT deviceId FROM devices WHERE STARTSWITH(deviceId, '${escapeQueryValue(deviceId)}')`;
        await this.waitForQueryResult(
            query,
            result => result.deviceId === deviceId,
            timeout,
            `Device ${deviceId} was not queryable within ${timeout}ms.`
        );
    }

    public async waitForModuleQueryable(deviceId: string, moduleId: string, timeout = 240_000): Promise<void> {
        const query = `SELECT moduleId FROM devices.modules WHERE deviceId in ['${escapeQueryValue(deviceId)}']`;
        await this.waitForQueryResult(
            query,
            result => result.moduleId === moduleId,
            timeout,
            `Module ${deviceId}/${moduleId} was not queryable within ${timeout}ms.`
        );
    }

    private async waitForQueryResult(
        sql: string,
        predicate: (result: QueryResult) => boolean,
        timeout: number,
        timeoutMessage: string
    ): Promise<void> {
        const deadline = Date.now() + timeout;
        while (Date.now() < deadline) {
            const results = await this.queryAll(sql);
            if (results.some(predicate)) {
                return;
            }
            await new Promise(resolve => setTimeout(resolve, 5_000));
        }
        throw new Error(timeoutMessage);
    }

    private async queryAll(sql: string): Promise<QueryResult[]> {
        const query = this.registry.createQuery(sql, 100);
        const results: QueryResult[] = [];
        try {
            while (query.hasMoreResults) {
                const page = await query.next();
                if (!Array.isArray(page.result)) {
                    throw new Error('IoT Hub registry query returned an unexpected response.');
                }
                results.push(...page.result as QueryResult[]);
            }
            return results;
        } catch (error) {
            throw this.operationError('IoT Hub registry query failed.', error);
        }
    }

    private async execute<T>(operation: () => Promise<T>, failureMessage: string): Promise<T> {
        try {
            return await operation();
        } catch (error) {
            throw this.operationError(failureMessage, error);
        }
    }

    private operationError(message: string, error: unknown): Error {
        const details = redactSecrets(errorMessage(error), this.environment);
        return new Error(`${message}${details ? `\n${details}` : ''}`);
    }
}
