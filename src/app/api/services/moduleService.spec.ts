/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import 'jest';
import * as ModuleService from './moduleService';
import * as DataplaneService from './dataplaneServiceHelper';
import { getConnectionInfoFromConnectionString } from '../shared/utils';
import { ModuleIdentity } from '../models/moduleIdentity';
import { ModuleTwin } from '../models/moduleTwin';

const deviceId = 'deviceId';
const moduleId = 'moduleId';
const connectionString = 'HostName=test-string.azure-devices.net;SharedAccessKeyName=owner;SharedAccessKey=fakeKey=';

// tslint:disable
const moduleIdentity: ModuleIdentity = {
    authentication: {symmetricKey: {primaryKey: null, secondaryKey: null}, type: 'sas', x509Thumbprint: null},
    cloudToDeviceMessageCount: null,
    deviceId,
    moduleId,
    etag: null,
    lastActivityTime: null
};
const moduleTwin: ModuleTwin = {
    deviceId,
    moduleId,
    etag: 'AAAAAAAAAAE=',
    deviceEtag: 'AAAAAAAAAAE=',
    status: 'enabled',
    statusUpdateTime: '0001-01-01T00:00:00Z',
    lastActivityTime: '0001-01-01T00:00:00Z',
    x509Thumbprint:  {primaryThumbprint: null, secondaryThumbprint: null},
    version: 1,
    connectionState: 'Disconnected',
    cloudToDeviceMessageCount: 0,
    authenticationType:'sas',
    properties: {}
}
// tslint:enable
const sasToken = 'testSasToken';
const connectionInfo = getConnectionInfoFromConnectionString(connectionString);

describe('moduleService', () => {

    beforeEach(() => {
        jest.clearAllMocks();
        jest.spyOn(DataplaneService, 'dataPlaneConnectionHelper').mockResolvedValue({
            connectionInfo,
            connectionString,
            sasToken
        });
    });

    context('fetchModuleIdentities', () => {
        const parameters = {
            connectionString,
            deviceId
        };

        it('calls IPC dataPlaneRequest and returns moduleIdentities when response is 200', async () => {
            (window as any).api_device.dataPlaneRequest.mockResolvedValue({
                body: { body: moduleIdentity },
                statusCode: 200
            });

            const result = await ModuleService.fetchModuleIdentities(parameters);

            expect((window as any).api_device.dataPlaneRequest).toHaveBeenCalled();
            expect(result).toEqual(moduleIdentity);
        });

        it('throws Error when IPC rejects', async () => {
            (window as any).api_device.dataPlaneRequest.mockRejectedValue(new Error('Not found'));
            await expect(ModuleService.fetchModuleIdentities(parameters)).rejects.toThrowError('Not found');
        });
    });

    context('addModuleIdentity', () => {
        const parameters = {
            connectionString,
            moduleIdentity
        };

        it('calls IPC dataPlaneRequest and returns moduleIdentity when response is 200', async () => {
            (window as any).api_device.dataPlaneRequest.mockResolvedValue({
                body: { body: moduleIdentity },
                statusCode: 200
            });

            const result = await ModuleService.addModuleIdentity(parameters);

            expect((window as any).api_device.dataPlaneRequest).toHaveBeenCalled();
            expect(result).toEqual(moduleIdentity);
        });

        it('throws Error when IPC rejects', async () => {
            (window as any).api_device.dataPlaneRequest.mockRejectedValue(new Error('Not found'));
            await expect(ModuleService.addModuleIdentity(parameters)).rejects.toThrowError('Not found');
        });
    });

    context('fetchModuleIdentityTwin', () => {
        const parameters = {
            connectionString,
            deviceId,
            moduleId
        };

        it('calls IPC dataPlaneRequest and returns moduleTwin when response is 200', async () => {
            (window as any).api_device.dataPlaneRequest.mockResolvedValue({
                body: { body: moduleTwin },
                statusCode: 200
            });

            const result = await ModuleService.fetchModuleIdentityTwin(parameters);

            expect((window as any).api_device.dataPlaneRequest).toHaveBeenCalled();
            expect(result).toEqual(moduleTwin);
        });

        it('throws Error when IPC rejects', async () => {
            (window as any).api_device.dataPlaneRequest.mockRejectedValue(new Error('Not found'));
            await expect(ModuleService.fetchModuleIdentityTwin(parameters)).rejects.toThrowError('Not found');
        });
    });

    context('fetchModuleIdentity', () => {
        const parameters = {
            connectionString,
            deviceId,
            moduleId
        };

        it('calls IPC dataPlaneRequest and returns module identity when response is 200', async () => {
            (window as any).api_device.dataPlaneRequest.mockResolvedValue({
                body: { body: moduleIdentity },
                statusCode: 200
            });

            const result = await ModuleService.fetchModuleIdentity(parameters);

            expect((window as any).api_device.dataPlaneRequest).toHaveBeenCalled();
            expect(result).toEqual(moduleIdentity);
        });

        it('throws Error when IPC rejects', async () => {
            (window as any).api_device.dataPlaneRequest.mockRejectedValue(new Error('Not found'));
            await expect(ModuleService.fetchModuleIdentity(parameters)).rejects.toThrowError('Not found');
        });
    });

    context('deleteModuleIdentity', () => {
        const parameters = {
            connectionString,
            deviceId,
            moduleId
        };

        it('calls IPC dataPlaneRequest and returns with no content when response is 204', async () => {
            (window as any).api_device.dataPlaneRequest.mockResolvedValue({
                body: {},
                statusCode: 204
            });

            const result = await ModuleService.deleteModuleIdentity(parameters);

            expect((window as any).api_device.dataPlaneRequest).toHaveBeenCalled();
            expect(result).toEqual(undefined);
        });

        it('throws Error when IPC rejects', async () => {
            (window as any).api_device.dataPlaneRequest.mockRejectedValue(new Error('Not found'));
            await expect(ModuleService.deleteModuleIdentity(parameters)).rejects.toThrowError('Not found');
        });
    });

    context('invokeModuleDirectMethod', () => {
        const parameters = {
            connectTimeoutInSeconds: 10,
            connectionString,
            deviceId: undefined as string,
            methodName: 'methodName',
            moduleId:'moduleId',
            payload: {foo: 'bar'},
            responseTimeoutInSeconds : 10,
        };

        it ('returns if deviceId is not specified', () => {
            expect(ModuleService.invokeModuleDirectMethod(parameters)).resolves.toBe(undefined);
        });

        it('calls IPC dataPlaneRequest and invokes invokeDirectMethod when response is 200', async () => {
            const responseBody = {description: 'invoked'};
            (window as any).api_device.dataPlaneRequest.mockResolvedValue({
                body: { body: responseBody },
                statusCode: 200
            });

            const result = await ModuleService.invokeModuleDirectMethod({
                ...parameters,
                deviceId
            });

            expect((window as any).api_device.dataPlaneRequest).toHaveBeenCalled();
            expect(result).toEqual(responseBody);
        });

        it('throws Error when IPC rejects', async () => {
            (window as any).api_device.dataPlaneRequest.mockRejectedValue(new Error());
            await expect(ModuleService.invokeModuleDirectMethod({
                ...parameters,
                deviceId
            })).rejects.toThrow(new Error());
        });
    });

    context('updateModuleTwin', () => {
        it('calls IPC dataPlaneRequest and invokes updateDeviceTwin when response is 200', async () => {
            const responseBody = moduleTwin;
            (window as any).api_device.dataPlaneRequest.mockResolvedValue({
                body: { body: responseBody },
                statusCode: 200
            });

            const result = await ModuleService.updateModuleIdentityTwin(moduleTwin);

            expect((window as any).api_device.dataPlaneRequest).toHaveBeenCalled();
            expect(result).toEqual(responseBody);
        });

        it('throws Error when IPC rejects', async () => {
            (window as any).api_device.dataPlaneRequest.mockRejectedValue(new Error());
            await expect(ModuleService.updateModuleIdentityTwin(moduleTwin)).rejects.toThrow(new Error());
        });
    });
});
