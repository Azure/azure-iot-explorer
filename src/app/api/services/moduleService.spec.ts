/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import 'jest';
import * as DevicesService from './devicesService';
import * as ModuleService from './moduleService';
import { HTTP_OPERATION_TYPES } from '../constants';
import { getConnectionInfoFromConnectionString } from '../shared/utils';
import { DataPlaneParameters } from '../parameters/deviceParameters';
import { ModuleIdentity } from '../models/moduleIdentity';
import { ModuleTwin } from '../models/moduleTwin';

const deviceId = 'deviceId';
const moduleId = 'moduleId';
const connectionString = 'HostName=test-string.azure-devices.net;SharedAccessKeyName=owner;SharedAccessKey=fakeKey=';
const headers = new Headers({
    'Accept': 'application/json',
    'Content-Type': 'application/json'
});
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
const mockDataPlaneConnectionHelper = (parameters: DataPlaneParameters) => {
    if (!parameters || !parameters.connectionString) {
        return;
    }

    const connectionInfo = getConnectionInfoFromConnectionString(parameters.connectionString);
    if (!(connectionInfo && connectionInfo.hostName)) {
        return;
    }
    return {
        connectionInfo,
        sasToken,
    };
};

describe('moduleService', () => {

    context('fetchModuleIdentities', () => {
        const parameters = {
                connectionString,
                deviceId
        };

        it('calls fetch with specified parameters and returns moduleIdentities when response is 200', async () => {
            jest.spyOn(DevicesService, 'dataPlaneConnectionHelper').mockReturnValue({
                connectionInfo: getConnectionInfoFromConnectionString(parameters.connectionString), sasToken});

            // tslint:disable
            const response = {
                json: () => {return {
                    body: moduleIdentity
                    }},
                status: 200
            } as any;
            // tslint:enable
            jest.spyOn(window, 'fetch').mockResolvedValue(response);

            const connectionInformation = mockDataPlaneConnectionHelper({connectionString});
            const dataPlaneRequest: DevicesService.DataPlaneRequest = {
                hostName: connectionInformation.connectionInfo.hostName,
                httpMethod: HTTP_OPERATION_TYPES.Get,
                path: `devices/${deviceId}/modules`,
                sharedAccessSignature: connectionInformation.sasToken
            };

            const result = await ModuleService.fetchModuleIdentities(parameters);

            const serviceRequestParams = {
                body: JSON.stringify(dataPlaneRequest),
                cache: 'no-cache',
                credentials: 'include',
                headers,
                method: HTTP_OPERATION_TYPES.Post,
                mode: 'cors',
            };

            expect(fetch).toBeCalledWith(DevicesService.DATAPLANE_CONTROLLER_ENDPOINT, serviceRequestParams);
            expect(result).toEqual(moduleIdentity);
        });

        it('throws Error when promise rejects', async done => {
            window.fetch = jest.fn().mockRejectedValueOnce(new Error('Not found'));
            await expect(ModuleService.fetchModuleIdentities(parameters)).rejects.toThrowError('Not found');
            done();
        });
    });

    context('addModuleIdentity', () => {
        const parameters = {
                connectionString,
                moduleIdentity
        };

        it('calls fetch with specified parameters and returns moduleIdentity when response is 200', async () => {
            jest.spyOn(DevicesService, 'dataPlaneConnectionHelper').mockReturnValue({
                connectionInfo: getConnectionInfoFromConnectionString(parameters.connectionString), sasToken});

            // tslint:disable
            const response = {
                json: () => {return {
                    body: moduleIdentity
                    }},
                status: 200
            } as any;
            // tslint:enable
            jest.spyOn(window, 'fetch').mockResolvedValue(response);

            const connectionInformation = mockDataPlaneConnectionHelper({connectionString});
            const dataPlaneRequest: DevicesService.DataPlaneRequest = {
                body: JSON.stringify(parameters.moduleIdentity),
                hostName: connectionInformation.connectionInfo.hostName,
                httpMethod: HTTP_OPERATION_TYPES.Put,
                path: `devices/${deviceId}/modules/${moduleIdentity.moduleId}`,
                sharedAccessSignature: connectionInformation.sasToken
            };

            const result = await ModuleService.addModuleIdentity(parameters);

            const serviceRequestParams = {
                body: JSON.stringify(dataPlaneRequest),
                cache: 'no-cache',
                credentials: 'include',
                headers,
                method: HTTP_OPERATION_TYPES.Post,
                mode: 'cors',
            };

            expect(fetch).toBeCalledWith(DevicesService.DATAPLANE_CONTROLLER_ENDPOINT, serviceRequestParams);
            expect(result).toEqual(moduleIdentity);
        });

        it('throws Error when promise rejects', async done => {
            window.fetch = jest.fn().mockRejectedValueOnce(new Error('Not found'));
            await expect(ModuleService.addModuleIdentity(parameters)).rejects.toThrowError('Not found');
            done();
        });
    });

    context('fetchModuleIdentityTwin', () => {
        const parameters = {
            connectionString,
            deviceId,
            moduleId
        };

        it('calls fetch with specified parameters and returns moduleTwin when response is 200', async () => {
            jest.spyOn(DevicesService, 'dataPlaneConnectionHelper').mockReturnValue({
                connectionInfo: getConnectionInfoFromConnectionString(parameters.connectionString), sasToken});

            // tslint:disable
            const response = {
                json: () => {return {
                    body: moduleTwin
                    }},
                status: 200
            } as any;
            // tslint:enable
            jest.spyOn(window, 'fetch').mockResolvedValue(response);

            const connectionInformation = mockDataPlaneConnectionHelper({connectionString});
            const dataPlaneRequest: DevicesService.DataPlaneRequest = {
                hostName: connectionInformation.connectionInfo.hostName,
                httpMethod: HTTP_OPERATION_TYPES.Get,
                path: `twins/${deviceId}/modules/${moduleId}`,
                sharedAccessSignature: connectionInformation.sasToken
            };

            const result = await ModuleService.fetchModuleIdentityTwin(parameters);

            const serviceRequestParams = {
                body: JSON.stringify(dataPlaneRequest),
                cache: 'no-cache',
                credentials: 'include',
                headers,
                method: HTTP_OPERATION_TYPES.Post,
                mode: 'cors',
            };

            expect(fetch).toBeCalledWith(DevicesService.DATAPLANE_CONTROLLER_ENDPOINT, serviceRequestParams);
            expect(result).toEqual(moduleTwin);
        });

        it('throws Error when promise rejects', async done => {
            window.fetch = jest.fn().mockRejectedValueOnce(new Error('Not found'));
            await expect(ModuleService.fetchModuleIdentityTwin(parameters)).rejects.toThrowError('Not found');
            done();
        });
    });

    context('fetchModuleIdentity', () => {
        const parameters = {
            connectionString,
            deviceId,
            moduleId
        };

        it('calls fetch with specified parameters and returns module identity when response is 200', async () => {
            jest.spyOn(DevicesService, 'dataPlaneConnectionHelper').mockReturnValue({
                connectionInfo: getConnectionInfoFromConnectionString(parameters.connectionString), sasToken});

            // tslint:disable
            const response = {
                json: () => {return {
                    body: moduleIdentity
                    }},
                status: 200
            } as any;
            // tslint:enable
            jest.spyOn(window, 'fetch').mockResolvedValue(response);

            const connectionInformation = mockDataPlaneConnectionHelper({connectionString});
            const dataPlaneRequest: DevicesService.DataPlaneRequest = {
                hostName: connectionInformation.connectionInfo.hostName,
                httpMethod: HTTP_OPERATION_TYPES.Get,
                path: `devices/${deviceId}/modules/${moduleId}`,
                sharedAccessSignature: connectionInformation.sasToken
            };

            const result = await ModuleService.fetchModuleIdentity(parameters);

            const serviceRequestParams = {
                body: JSON.stringify(dataPlaneRequest),
                cache: 'no-cache',
                credentials: 'include',
                headers,
                method: HTTP_OPERATION_TYPES.Post,
                mode: 'cors',
            };

            expect(fetch).toBeCalledWith(DevicesService.DATAPLANE_CONTROLLER_ENDPOINT, serviceRequestParams);
            expect(result).toEqual(moduleIdentity);
        });

        it('throws Error when promise rejects', async done => {
            window.fetch = jest.fn().mockRejectedValueOnce(new Error('Not found'));
            await expect(ModuleService.fetchModuleIdentity(parameters)).rejects.toThrowError('Not found');
            done();
        });
    });
});
