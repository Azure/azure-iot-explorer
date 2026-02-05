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
import { HTTP_OPERATION_TYPES, HUB_DATA_PLANE_API_VERSION } from '../../constants/apiConstants';

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
const connectionInfo = getConnectionInfoFromConnectionString(connectionString);
const mockDataPlaneConnectionHelper = () => {
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

        beforeEach(() => {
            jest.spyOn(DataplaneService, 'dataPlaneConnectionHelper').mockResolvedValue({
                connectionInfo: getConnectionInfoFromConnectionString(parameters.connectionString), connectionString, sasToken});
        });

        it('calls fetch with specified parameters and returns moduleIdentities when response is 200', async () => {
            // tslint:disable
            const response = {
                json: () => {return {
                    body: moduleIdentity
                    }},
                status: 200
            } as any;
            // tslint:enable
            jest.spyOn(window, 'fetch').mockResolvedValue(response);

            const connectionInformation = mockDataPlaneConnectionHelper();
            const dataPlaneRequest: DataplaneService.DataPlaneRequest = {
                apiVersion:  HUB_DATA_PLANE_API_VERSION,
                body: JSON.stringify({
                    query: `SELECT * FROM devices.modules WHERE deviceId in ['${parameters.deviceId}']`,
                }),
                hostName: connectionInformation.connectionInfo.hostName,
                httpMethod: HTTP_OPERATION_TYPES.Post,
                path: 'devices/query',
                sharedAccessSignature: connectionInformation.sasToken,
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

            expect(fetch).toBeCalledWith(DataplaneService.DATAPLANE_CONTROLLER_ENDPOINT, serviceRequestParams);
            expect(result).toEqual(moduleIdentity);
        });

        it('throws Error when promise rejects', async () => {
            window.fetch = jest.fn().mockRejectedValueOnce(new Error('Not found'));
            await expect(ModuleService.fetchModuleIdentities(parameters)).rejects.toThrowError('Not found');
        });
    });

    context('addModuleIdentity', () => {
        const parameters = {
                connectionString,
                moduleIdentity
        };

        it('calls fetch with specified parameters and returns moduleIdentity when response is 200', async () => {
            // tslint:disable
            const response = {
                json: () => {return {
                    body: moduleIdentity
                    }},
                status: 200
            } as any;
            // tslint:enable
            jest.spyOn(window, 'fetch').mockResolvedValue(response);

            const connectionInformation = mockDataPlaneConnectionHelper();
            const dataPlaneRequest: DataplaneService.DataPlaneRequest = {
                apiVersion:  HUB_DATA_PLANE_API_VERSION,
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

            expect(fetch).toBeCalledWith(DataplaneService.DATAPLANE_CONTROLLER_ENDPOINT, serviceRequestParams);
            expect(result).toEqual(moduleIdentity);
        });

        it('throws Error when promise rejects', async () => {
            window.fetch = jest.fn().mockRejectedValueOnce(new Error('Not found'));
            await expect(ModuleService.addModuleIdentity(parameters)).rejects.toThrowError('Not found');
        });
    });

    context('fetchModuleIdentityTwin', () => {
        const parameters = {
            connectionString,
            deviceId,
            moduleId
        };

        it('calls fetch with specified parameters and returns moduleTwin when response is 200', async () => {
            // tslint:disable
            const response = {
                json: () => {return {
                    body: moduleTwin
                    }},
                status: 200
            } as any;
            // tslint:enable
            jest.spyOn(window, 'fetch').mockResolvedValue(response);

            const connectionInformation = mockDataPlaneConnectionHelper();
            const dataPlaneRequest: DataplaneService.DataPlaneRequest = {
                apiVersion:  HUB_DATA_PLANE_API_VERSION,
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

            expect(fetch).toBeCalledWith(DataplaneService.DATAPLANE_CONTROLLER_ENDPOINT, serviceRequestParams);
            expect(result).toEqual(moduleTwin);
        });

        it('throws Error when promise rejects', async () => {
            window.fetch = jest.fn().mockRejectedValueOnce(new Error('Not found'));
            await expect(ModuleService.fetchModuleIdentityTwin(parameters)).rejects.toThrowError('Not found');
        });
    });

    context('fetchModuleIdentity', () => {
        const parameters = {
            connectionString,
            deviceId,
            moduleId
        };

        it('calls fetch with specified parameters and returns module identity when response is 200', async () => {
            // tslint:disable
            const response = {
                json: () => {return {
                    body: moduleIdentity
                    }},
                status: 200
            } as any;
            // tslint:enable
            jest.spyOn(window, 'fetch').mockResolvedValue(response);

            const connectionInformation = mockDataPlaneConnectionHelper();
            const dataPlaneRequest: DataplaneService.DataPlaneRequest = {
                apiVersion:  HUB_DATA_PLANE_API_VERSION,
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

            expect(fetch).toBeCalledWith(DataplaneService.DATAPLANE_CONTROLLER_ENDPOINT, serviceRequestParams);
            expect(result).toEqual(moduleIdentity);
        });

        it('throws Error when promise rejects', async () => {
            window.fetch = jest.fn().mockRejectedValueOnce(new Error('Not found'));
            await expect(ModuleService.fetchModuleIdentity(parameters)).rejects.toThrowError('Not found');
        });
    });

    context('deleteModuleIdentity', () => {
        const parameters = {
            connectionString,
            deviceId,
            moduleId
        };

        it('calls fetch with specified parameters and returns with no content when response is 204', async () => {
            // tslint:disable
            const response = {
                json: () => {return {
                    body: moduleIdentity
                    }},
                status: 204
            } as any;
            // tslint:enable
            jest.spyOn(window, 'fetch').mockResolvedValue(response);

            const connectionInformation = mockDataPlaneConnectionHelper();
            const dataPlaneRequest: DataplaneService.DataPlaneRequest = {
                apiVersion:  HUB_DATA_PLANE_API_VERSION,
                headers: {'If-Match': '*'},
                hostName: connectionInformation.connectionInfo.hostName,
                httpMethod: HTTP_OPERATION_TYPES.Delete,
                path: `devices/${deviceId}/modules/${moduleId}`,
                sharedAccessSignature: connectionInformation.sasToken
            };

            const result = await ModuleService.deleteModuleIdentity(parameters);

            const serviceRequestParams = {
                body: JSON.stringify(dataPlaneRequest),
                cache: 'no-cache',
                credentials: 'include',
                headers,
                method: HTTP_OPERATION_TYPES.Post,
                mode: 'cors',
            };

            expect(fetch).toBeCalledWith(DataplaneService.DATAPLANE_CONTROLLER_ENDPOINT, serviceRequestParams);
            expect(result).toEqual(undefined);
        });

        it('throws Error when promise rejects', async () => {
            window.fetch = jest.fn().mockRejectedValueOnce(new Error('Not found'));
            await expect(ModuleService.deleteModuleIdentity(parameters)).rejects.toThrowError('Not found');
        });
    });

    context('invokeModuleDirectMethod', () => {
        const parameters = {
            connectTimeoutInSeconds: 10,
            connectionString,
            deviceId: undefined,
            methodName: 'methodName',
            moduleId:'moduleId',
            payload: {foo: 'bar'},
            responseTimeoutInSeconds : 10,
        };
        it ('returns if deviceId is not specified', () => {
            expect(ModuleService.invokeModuleDirectMethod(parameters)).resolves.toBe(undefined);
        });

        it('calls fetch with specified parameters and invokes invokeDirectMethod when response is 200', async () => {
            jest.spyOn(DataplaneService, 'dataPlaneConnectionHelper').mockResolvedValue({
                connectionInfo: getConnectionInfoFromConnectionString(parameters.connectionString), connectionString, sasToken});

            // tslint:disable
            const responseBody = {description: 'invoked'};
            const response = {
                json: () => {
                    return {
                        body: responseBody,
                        headers:{}
                        }
                    },
                status: 200
            } as any;
            // tslint:enable
            jest.spyOn(window, 'fetch').mockResolvedValue(response);

            const result = await ModuleService.invokeModuleDirectMethod({
                ...parameters,
                deviceId
            });

            const connectionInformation = mockDataPlaneConnectionHelper();
            const dataPlaneRequest: DataplaneService.DataPlaneRequest = {
                apiVersion:  HUB_DATA_PLANE_API_VERSION,
                body: JSON.stringify({
                    connectTimeoutInSeconds: parameters.connectTimeoutInSeconds,
                    methodName: parameters.methodName,
                    payload: parameters.payload,
                    responseTimeoutInSeconds: parameters.responseTimeoutInSeconds,
                }),
                hostName: connectionInformation.connectionInfo.hostName,
                httpMethod: HTTP_OPERATION_TYPES.Post,
                path: `twins/${deviceId}/modules/moduleId/methods`,
                sharedAccessSignature: connectionInformation.sasToken
            };

            const serviceRequestParams = {
                body: JSON.stringify(dataPlaneRequest),
                cache: 'no-cache',
                credentials: 'include',
                headers,
                method: HTTP_OPERATION_TYPES.Post,
                mode: 'cors',
            };

            expect(fetch).toBeCalledWith(DataplaneService.DATAPLANE_CONTROLLER_ENDPOINT, serviceRequestParams);
            expect(result).toEqual(responseBody);
        });

        it('throws Error when promise rejects', async () => {
            window.fetch = jest.fn().mockRejectedValueOnce(new Error());
            await expect(ModuleService.invokeModuleDirectMethod({
                ...parameters,
                deviceId
            })).rejects.toThrow(new Error());
        });
    });

    context('updateModuleTwin', () => {
        it('calls fetch with specified parameters and invokes updateDeviceTwin when response is 200', async () => {
            jest.spyOn(DataplaneService, 'dataPlaneConnectionHelper').mockResolvedValue({
                connectionInfo, connectionString, sasToken});

            // tslint:disable
            const responseBody = moduleTwin;
            const response = {
                json: () => {
                    return {
                        body: responseBody,
                        headers:{}
                        }
                    },
                status: 200
            } as any;
            // tslint:enable
            jest.spyOn(window, 'fetch').mockResolvedValue(response);

            const result = await ModuleService.updateModuleIdentityTwin(moduleTwin);

            const connectionInformation = mockDataPlaneConnectionHelper();
            const dataPlaneRequest: DataplaneService.DataPlaneRequest = {
                apiVersion: HUB_DATA_PLANE_API_VERSION,
                body: JSON.stringify(moduleTwin),
                hostName: connectionInformation.connectionInfo.hostName,
                httpMethod: HTTP_OPERATION_TYPES.Patch,
                path: `twins/${deviceId}/modules/${moduleId}`,
                sharedAccessSignature: connectionInformation.sasToken
            };

            const serviceRequestParams = {
                body: JSON.stringify(dataPlaneRequest),
                cache: 'no-cache',
                credentials: 'include',
                headers,
                method: HTTP_OPERATION_TYPES.Post,
                mode: 'cors',
            };

            expect(fetch).toBeCalledWith(DataplaneService.DATAPLANE_CONTROLLER_ENDPOINT, serviceRequestParams);
            expect(result).toEqual(responseBody);
        });

        it('throws Error when promise rejects', async () => {
            window.fetch = jest.fn().mockRejectedValueOnce(new Error());
            await expect(ModuleService.updateModuleIdentityTwin(moduleTwin)).rejects.toThrow(new Error());
        });
    });
});
