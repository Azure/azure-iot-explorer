/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import 'jest';
import * as DevicesService from './devicesService';
import * as DataplaneService from './dataplaneServiceHelper';
import { HTTP_OPERATION_TYPES, HUB_DATA_PLANE_API_VERSION } from '../../constants/apiConstants';
import { Twin } from '../models/device';
import { DeviceIdentity } from './../models/deviceIdentity';
import { buildQueryString, getConnectionInfoFromConnectionString } from '../shared/utils';
import { MonitorEventsParameters } from '../parameters/deviceParameters';
import { EVENTHUB_MONITOR_ENDPOINT, EVENTHUB_STOP_ENDPOINT } from '../handlers/eventHubServiceHandler';

const deviceId = 'deviceId';
const connectionString = 'HostName=test-string.azure-devices.net;SharedAccessKeyName=owner;SharedAccessKey=fakeKey=';
const connectionInfo = getConnectionInfoFromConnectionString(connectionString);
const headers = new Headers({
    'Accept': 'application/json',
    'Content-Type': 'application/json'
});
// tslint:disable
const twin: Twin = {
    deviceId,
    deviceEtag: '',
    etag: 'AAAAAAAAAAE=',
    status: 'enabled',
    statusUpdateTime: '0001-01-01T00:00:00Z',
    connectionState: 'Disconnected',
    lastActivityTime: '0001-01-01T00:00:00Z',
    cloudToDeviceMessageCount: 0,
    authenticationType: 'sas',
    x509Thumbprint: {primaryThumbprint: null, secondaryThumbprint: null},
    properties: {},
    capabilities: {iotEdge: false},
    version: 1
};
const deviceIdentity: DeviceIdentity = {
        authentication: {symmetricKey: {primaryKey: null, secondaryKey: null}, type: 'sas', x509Thumbprint: null},
        capabilities: {iotEdge: false},
        cloudToDeviceMessageCount: null,
        deviceId,
        etag: null,
        lastActivityTime: null,
        status: 'enabled',
        statusReason: null,
        statusUpdatedTime: null
    };
// tslint:enable
const sasToken = 'testSasToken';
const mockDataPlaneConnectionHelper = () => {
    if (!(connectionInfo && connectionInfo.hostName)) {
        return;
    }
    return {
        connectionInfo,
        sasToken,
    };
};

describe('deviceTwinService', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    context('fetchDeviceTwin', () => {
        it ('returns if deviceId is not specified', () => {
            expect(DevicesService.fetchDeviceTwin({deviceId: undefined})).resolves.toBe(undefined);
        });

        it('calls fetch with specified parameters and returns deviceTwin when response is 200', async () => {
            jest.spyOn(DataplaneService, 'dataPlaneConnectionHelper').mockResolvedValue({
                connectionInfo, connectionString, sasToken});

            // tslint:disable
            const response = {
                json: () => {return {
                    body: twin,
                    headers:{}
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
                path: `twins/${deviceId}`,
                sharedAccessSignature: connectionInformation.sasToken
            };

            const result = await DevicesService.fetchDeviceTwin({deviceId});

            const serviceRequestParams = {
                body: JSON.stringify(dataPlaneRequest),
                cache: 'no-cache',
                credentials: 'include',
                headers,
                method: HTTP_OPERATION_TYPES.Post,
                mode: 'cors',
            };

            expect(fetch).toBeCalledWith(DataplaneService.DATAPLANE_CONTROLLER_ENDPOINT, serviceRequestParams);
            expect(result).toEqual(twin);
        });

        it('throws Error when promise rejects', async done => {
            window.fetch = jest.fn().mockRejectedValueOnce(new Error('Not found'));
            await expect(DevicesService.fetchDeviceTwin({deviceId})).rejects.toThrowError('Not found');
            done();
        });
    });

    context('updateDeviceTwin', () => {
        it('calls fetch with specified parameters and invokes updateDeviceTwin when response is 200', async () => {
            jest.spyOn(DataplaneService, 'dataPlaneConnectionHelper').mockResolvedValue({
                connectionInfo, connectionString, sasToken});

            // tslint:disable
            const responseBody = twin;
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

            const result = await DevicesService.updateDeviceTwin(twin);

            const connectionInformation = mockDataPlaneConnectionHelper();
            const dataPlaneRequest: DataplaneService.DataPlaneRequest = {
                apiVersion: HUB_DATA_PLANE_API_VERSION,
                body: JSON.stringify(twin),
                hostName: connectionInformation.connectionInfo.hostName,
                httpMethod: HTTP_OPERATION_TYPES.Patch,
                path: `twins/${deviceId}`,
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
            await expect(DevicesService.updateDeviceTwin(twin)).rejects.toThrow(new Error());
        });
    });

    context('invokeDirectMethod', () => {
        const parameters = {
            connectTimeoutInSeconds: 10,
            connectionString,
            deviceId: undefined,
            methodName: 'methodName',
            payload: {foo: 'bar'},
            responseTimeoutInSeconds : 10,
        };
        it ('returns if deviceId is not specified', () => {
            expect(DevicesService.invokeDirectMethod(parameters)).resolves.toBe(undefined);
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

            const result = await DevicesService.invokeDirectMethod({
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
                path: `twins/${deviceId}/methods`,
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
            await expect(DevicesService.invokeDirectMethod({
                ...parameters,
                deviceId
            })).rejects.toThrow(new Error());
        });
    });

    context('cloudToDeviceMessage', () => {
        const parameters = {
            body: 'body',
            deviceId: 'deviceId',
            properties: []
        };

        it('calls sendMessageToDevice with expected parameters', async () => {

            jest.spyOn(DataplaneService, 'dataPlaneConnectionHelper').mockResolvedValue({
                connectionInfo: getConnectionInfoFromConnectionString(connectionString), connectionString, sasToken});

            // tslint:disable
            const responseBody = {description: 'sent'};
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

            const result = await DevicesService.cloudToDeviceMessage({
                ...parameters,
                deviceId
            });

            const connectionInformation = mockDataPlaneConnectionHelper();
            const dataPlaneRequest: DataplaneService.DataPlaneRequest = {
                apiVersion: HUB_DATA_PLANE_API_VERSION,
                body: 'body',
                headers: {
                    'authorization': `testSasToken`,
                    ['Content-Encoding']: 'utf-8'
                },
                hostName: connectionInformation.connectionInfo.hostName,
                httpMethod: HTTP_OPERATION_TYPES.Post,
                path: `devices/${encodeURIComponent(deviceId)}/messages/deviceBound`,
                sharedAccessSignature: sasToken,
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
    });

    context('addDevice', () => {
        const parameters = {
            connectionString,
            deviceIdentity: undefined
        };
        it ('returns if deviceIdentity is not specified', () => {
            expect(DevicesService.addDevice(parameters)).resolves.toBe(undefined);
        });

        it('calls fetch with specified parameters and invokes addDevice when response is 200', async () => {
            jest.spyOn(DataplaneService, 'dataPlaneConnectionHelper').mockResolvedValue({
                connectionInfo: getConnectionInfoFromConnectionString(parameters.connectionString), connectionString, sasToken});
            // tslint:disable
            const responseBody = deviceIdentity;
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

            const result = await DevicesService.addDevice({
                ...parameters,
                deviceIdentity
            });

            const connectionInformation = mockDataPlaneConnectionHelper();
            const dataPlaneRequest: DataplaneService.DataPlaneRequest = {
                apiVersion: HUB_DATA_PLANE_API_VERSION,
                body: JSON.stringify(deviceIdentity),
                hostName: connectionInformation.connectionInfo.hostName,
                httpMethod: HTTP_OPERATION_TYPES.Put,
                path: `devices/${deviceId}`,
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
            await expect(DevicesService.addDevice({
                ...parameters,
                deviceIdentity
            })).rejects.toThrow(new Error());
        });
    });

    context('updateDevice', () => {
        const parameters = {
            connectionString,
            deviceIdentity: undefined
        };
        it ('returns if deviceIdentity is not specified', () => {
            expect(DevicesService.updateDevice(parameters)).resolves.toBe(undefined);
        });

        it('calls fetch with specified parameters and invokes updateDevice when response is 200', async () => {
            jest.spyOn(DataplaneService, 'dataPlaneConnectionHelper').mockResolvedValue({
                connectionInfo: getConnectionInfoFromConnectionString(parameters.connectionString), connectionString, sasToken});
            // tslint:disable
            const responseBody = deviceIdentity;
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

            const result = await DevicesService.updateDevice({
                ...parameters,
                deviceIdentity
            });

            const connectionInformation = mockDataPlaneConnectionHelper();
            const dataPlaneRequest: DataplaneService.DataPlaneRequest = {
                apiVersion:  HUB_DATA_PLANE_API_VERSION,
                body: JSON.stringify(deviceIdentity),
                headers: {'If-Match': `"null"`},
                hostName: connectionInformation.connectionInfo.hostName,
                httpMethod: HTTP_OPERATION_TYPES.Put,
                path: `devices/${deviceId}`,
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
            await expect(DevicesService.updateDevice({
                ...parameters,
                deviceIdentity
            })).rejects.toThrow(new Error());
        });
    });

    context('fetchDevice', () => {
        const parameters = {
            connectionString,
            deviceId: undefined
        };
        it ('returns if deviceId is not specified', () => {
            expect(DevicesService.fetchDevice(parameters)).resolves.toBe(undefined);
        });

        it('calls fetch with specified parameters and invokes fetchDevice when response is 200', async () => {
            jest.spyOn(DataplaneService, 'dataPlaneConnectionHelper').mockResolvedValue({
                connectionInfo: getConnectionInfoFromConnectionString(parameters.connectionString), connectionString, sasToken});
            // tslint:disable
            const responseBody = deviceIdentity;
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

            const result = await DevicesService.fetchDevice({
                ...parameters,
                deviceId
            });

            const connectionInformation = mockDataPlaneConnectionHelper();
            const dataPlaneRequest: DataplaneService.DataPlaneRequest = {
                apiVersion:  HUB_DATA_PLANE_API_VERSION,
                hostName: connectionInformation.connectionInfo.hostName,
                httpMethod: HTTP_OPERATION_TYPES.Get,
                path: `devices/${deviceId}`,
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
            await expect(DevicesService.fetchDevice({
                ...parameters,
                deviceId
            })).rejects.toThrowError();
        });
    });

    context('fetchDevices', () => {
        const parameters = {
            connectionString,
            query: {
                clauses: [],
                continuationTokens: ['', '123'],
                currentPageIndex: 1,
                deviceId
            }
        };

        it('calls fetch with specified parameters and invokes fetchDevices when response is 200', async () => {
            jest.spyOn(DataplaneService, 'dataPlaneConnectionHelper').mockResolvedValue({
                connectionInfo: getConnectionInfoFromConnectionString(parameters.connectionString), connectionString, sasToken});
            // tslint:disable
            const responseBody = deviceIdentity;
            const response = {
                json: () => {
                    return {
                        body: [responseBody],
                        headers:{foo: 'bar'}
                        }
                    },
                status: 200
            } as any;
            // tslint:enable
            jest.spyOn(window, 'fetch').mockResolvedValue(response);

            const result = await DevicesService.fetchDevices(parameters);

            const connectionInformation = mockDataPlaneConnectionHelper();
            const queryString = buildQueryString(parameters.query);

            const dataPlaneRequest: DataplaneService.DataPlaneRequest = {
                apiVersion:  HUB_DATA_PLANE_API_VERSION,
                body: JSON.stringify({
                    query: queryString,
                }),
                headers: {'x-ms-max-item-count': 100, 'x-ms-continuation': '123'},
                hostName: connectionInformation.connectionInfo.hostName,
                httpMethod: HTTP_OPERATION_TYPES.Post,
                path: 'devices/query',
                sharedAccessSignature: connectionInformation.sasToken,
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
            expect(result).toEqual({body: [responseBody], headers: {foo: 'bar'}});
        });

        it('throws Error when promise rejects', async () => {
            window.fetch = jest.fn().mockRejectedValueOnce(new Error());
            await expect(DevicesService.fetchDevices(parameters)).rejects.toThrow(new Error()).catch();
        });
    });

    context('deleteDevices', () => {
        let parameters = {
            connectionString,
            deviceIds: undefined
        };
        it ('returns if deviceId is not specified', () => {
            expect(DevicesService.deleteDevices(parameters)).resolves.toBe(undefined);
        });

        it('calls fetch with specified parameters and invokes deleteDevices when response is 200', async () => {
            jest.spyOn(DataplaneService, 'dataPlaneConnectionHelper').mockResolvedValue({
                connectionInfo: getConnectionInfoFromConnectionString(parameters.connectionString), connectionString, sasToken});

             // tslint:disable
             const responseBody = {isSuccessful:true, errors:[], warnings:[]};
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

            parameters = {
                ...parameters,
                deviceIds: [deviceId]
            };

            const result = await DevicesService.deleteDevices(parameters);

            const connectionInformation = mockDataPlaneConnectionHelper();
            const deviceDeletionInstructions = parameters.deviceIds.map(id => {
                return {
                    etag: '*',
                    id,
                    importMode: 'deleteIfMatchEtag'
                };
            });
            const dataPlaneRequest: DataplaneService.DataPlaneRequest = {
                apiVersion:  HUB_DATA_PLANE_API_VERSION,
                body: JSON.stringify(deviceDeletionInstructions),
                hostName: connectionInformation.connectionInfo.hostName,
                httpMethod: HTTP_OPERATION_TYPES.Post,
                path: `devices`,
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

        it('throws Error when response status is 500', async () => {
            // tslint:disable
            const response = {
                json: () => {return {
                    body: {},
                    headers:{}
                    }},
                status: 500
            } as any;
            // tslint:enable
            jest.spyOn(window, 'fetch').mockResolvedValue(response);

            await expect(DevicesService.deleteDevices({
                ...parameters,
                deviceIds: [deviceId]
            })).rejects.toThrow(new Error('500')).catch();
        });
    });

    context('monitorEvents', () => {
        const parameters: MonitorEventsParameters = {
            consumerGroup: '$Default',
            customEventHubConnectionString: 'customConnectionString',
            deviceId,
            moduleId: ''
        };

        it('calls fetch with specified parameters', async () => {
            // tslint:disable
            const response = {
                json: () => {
                    return {
                        headers:{}
                        }
                    },
                status: 200
            } as any;
            // tslint:enable
            jest.spyOn(window, 'fetch').mockResolvedValue(response);

            await DevicesService.monitorEvents(parameters);
            expect(fetch).toBeCalledWith(EVENTHUB_MONITOR_ENDPOINT, {
                body: JSON.stringify(parameters),
                cache: 'no-cache',
                credentials: 'include',
                headers: new Headers({
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                }),
                method: HTTP_OPERATION_TYPES.Post,
                mode: 'cors',
            });
        });

        it('throws Error when promise rejects', async () => {
            window.fetch = jest.fn().mockRejectedValueOnce(new Error());
            await expect(DevicesService.monitorEvents(parameters)).rejects.toThrow(new Error());
        });
    });


    context('stopMonitoringEvents', () => {
        it('calls fetch with specified parameters', async () => {
            // tslint:disable
            const response = {
                json: () => {
                    return {
                        headers:{}
                        }
                    },
                status: 200
            } as any;
            // tslint:enable
            jest.spyOn(window, 'fetch').mockResolvedValue(response);

            await DevicesService.stopMonitoringEvents();
            expect(fetch).toBeCalledWith(EVENTHUB_STOP_ENDPOINT, {
                body: JSON.stringify({}),
                cache: 'no-cache',
                credentials: 'include',
                headers: new Headers({
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                }),
                method: HTTP_OPERATION_TYPES.Post,
                mode: 'cors',
            });
        });

        it('throws Error when promise rejects', async () => {
            window.fetch = jest.fn().mockRejectedValueOnce(new Error());
            await expect(DevicesService.stopMonitoringEvents()).rejects.toThrow(new Error());
        });
    });
});
