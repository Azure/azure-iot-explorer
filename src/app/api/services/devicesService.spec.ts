/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import 'jest';
import * as DevicesService from './devicesService';
import * as DataplaneService from './dataplaneServiceHelper';
import { CONTROLLER_API_ENDPOINT, CLOUD_TO_DEVICE, HTTP_OPERATION_TYPES, HUB_DATA_PLANE_API_VERSION} from '../../constants/apiConstants';
import { Twin } from '../models/device';
import { DeviceIdentity } from './../models/deviceIdentity';
import { buildQueryString, getConnectionInfoFromConnectionString } from '../shared/utils';
import { MonitorEventsParameters } from '../parameters/deviceParameters';

const deviceId = 'deviceId';
const connectionString = 'HostName=test-string.azure-devices.net;SharedAccessKeyName=owner;SharedAccessKey=fakeKey=';
const connectionInfo = getConnectionInfoFromConnectionString(connectionString);
const headers = new Headers({
    'Accept': 'application/json',
    'Content-Type': 'application/json'
});
// tslint:disable
const emptyPromise = new Promise(() => {});
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

    context('fetchDeviceTwin', () => {
        const parameters = {
                connectionString,
                deviceId: undefined
        };
        it ('returns if deviceId is not specified', () => {
            expect(DevicesService.fetchDeviceTwin(parameters)).toEqual(emptyPromise);
        });

        it ('throws if connection string is not valid', async () => {
            await expect(DevicesService.fetchDeviceTwin({...parameters, deviceId, connectionString: undefined})).rejects.toThrow();
            await expect(DevicesService.fetchDeviceTwin({...parameters, deviceId, connectionString: 'SharedAccessKeyName=owner;SharedAccessKey=fakeKey='})).rejects.toThrow();
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
                apiVersion: HUB_DATA_PLANE_API_VERSION,
                hostName: connectionInformation.connectionInfo.hostName,
                httpMethod: HTTP_OPERATION_TYPES.Get,
                path: `twins/${deviceId}`,
                sharedAccessSignature: connectionInformation.sasToken
            };

            const result = await DevicesService.fetchDeviceTwin({
                ...parameters,
                deviceId
            });

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
            await expect(DevicesService.fetchDeviceTwin({
                ...parameters,
                deviceId
            })).rejects.toThrowError('Not found');
            done();
        });
    });

    context('updateDeviceTwin', () => {
        const parameters = {
            connectionString,
            deviceId: undefined,
            deviceTwin: twin
        };
        it ('returns if deviceId is not specified', () => {
            expect(DevicesService.updateDeviceTwin(parameters)).toEqual(emptyPromise);
        });

        it('calls fetch with specified parameters and invokes updateDeviceTwin when response is 200', async () => {
            jest.spyOn(DataplaneService, 'dataPlaneConnectionHelper').mockResolvedValue({
                connectionInfo: getConnectionInfoFromConnectionString(parameters.connectionString), connectionString, sasToken});

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

            const result = await DevicesService.updateDeviceTwin({
                ...parameters,
                deviceId
            });

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
            await expect(DevicesService.updateDeviceTwin({
                ...parameters,
                deviceId
            })).rejects.toThrow(new Error());
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
            expect(DevicesService.invokeDirectMethod(parameters)).toEqual(emptyPromise);
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
            body: '',
            connectionString,
            deviceId: undefined,
            properties: undefined
        };

        it('calls fetch with specified parameters', async () => {
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

            await DevicesService.cloudToDeviceMessage({
                ...parameters,
                deviceId
            });
            expect(fetch).toBeCalledWith(`${CONTROLLER_API_ENDPOINT}${CLOUD_TO_DEVICE}`, {
                body: JSON.stringify({
                    ...parameters,
                    deviceId
                }),
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
            window.fetch = jest.fn().mockRejectedValueOnce(new Error('error'));
            await expect(DevicesService.cloudToDeviceMessage({
                ...parameters,
                deviceId
            })).rejects.toThrow(new Error('error'));
        });
    });

    context('addDevice', () => {
        const parameters = {
            connectionString,
            deviceIdentity: undefined
        };
        it ('returns if deviceIdentity is not specified', () => {
            expect(DevicesService.addDevice(parameters)).toEqual(emptyPromise);
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
                apiVersion:  HUB_DATA_PLANE_API_VERSION,
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
            expect(DevicesService.updateDevice(parameters)).toEqual(emptyPromise);
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
            expect(DevicesService.fetchDevice(parameters)).toEqual(emptyPromise);
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
            expect(DevicesService.deleteDevices(parameters)).toEqual(emptyPromise);
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
            customEventHubConnectionString: undefined,
            deviceId,
            fetchSystemProperties: undefined,
            hubConnectionString: undefined,
            startTime: undefined
        };
        it ('returns if hubConnectionString is not specified', () => {
            expect(DevicesService.monitorEvents(parameters)).toEqual(emptyPromise);
        });

        it('calls fetch with specified parameters and invokes monitorEvents when response is 200', async () => {
            jest.spyOn(DataplaneService, 'dataPlaneConnectionHelper').mockResolvedValue({
                connectionInfo: getConnectionInfoFromConnectionString(connectionString), connectionString, sasToken});
            // tslint:disable
            const responseBody = [{'body':{'temp':0},'enqueuedTime':'2019-09-06T17:47:11.334Z','properties':{'iothub-message-schema':'temp'}}];
            const response = {
                json: () => responseBody,
                status: 200
            } as any;
            // tslint:enable
            jest.spyOn(window, 'fetch').mockResolvedValue(response);

            const result = await DevicesService.monitorEvents(parameters);

            const eventHubRequestParameters = {
                ...parameters,
                hubConnectionString: connectionString,
                startTime: parameters.startTime && parameters.startTime.toISOString()
            };

            const serviceRequestParams = {
                body: JSON.stringify(eventHubRequestParameters),
                cache: 'no-cache',
                credentials: 'include',
                headers,
                method: HTTP_OPERATION_TYPES.Post,
                mode: 'cors',
            };

            expect(fetch).toBeCalledWith(DevicesService.EVENTHUB_MONITOR_ENDPOINT, serviceRequestParams);
            expect(result).toEqual(responseBody);
        });
    });

    context('stopMonitoringEvents', () => {
        it('calls fetch with specified parameters', () => {
            DevicesService.stopMonitoringEvents();
            const serviceRequestParams = {
                body: JSON.stringify({}),
                cache: 'no-cache',
                credentials: 'include',
                headers,
                method: HTTP_OPERATION_TYPES.Post,
                mode: 'cors',
            };
            expect(fetch).toBeCalledWith(DevicesService.EVENTHUB_STOP_ENDPOINT, serviceRequestParams);
        });
    });
});
