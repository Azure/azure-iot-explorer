/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import 'jest';
import * as DigitalTwinService from './digitalTwinService';
import * as DataplaneService from './dataplaneServiceHelper';
import { DIGITAL_TWIN_API_VERSION, HTTP_OPERATION_TYPES } from '../../constants/apiConstants';
import { CONNECTION_TIMEOUT_IN_SECONDS, RESPONSE_TIME_IN_SECONDS } from '../../constants/devices';
import { Twin } from '../models/device';
import { DeviceIdentity } from '../models/deviceIdentity';
import { getConnectionInfoFromConnectionString } from '../shared/utils';
import { DataPlaneParameters } from '../parameters/deviceParameters';

const deviceId = 'deviceId';
const connectionString = 'HostName=test-string.azure-devices.net;SharedAccessKeyName=owner;SharedAccessKey=fakeKey=';
const componentName = 'componentName';
const headers = new Headers({
    'Accept': 'application/json',
    'Content-Type': 'application/json'
});
// tslint:disable-next-line:no-empty
const emptyPromise = new Promise(() => {});
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

describe('digitalTwinService', () => {

    context('fetchDigitalTwinInterfaceProperties', () => {
        const parameters = {
            connectionString,
            digitalTwinId: undefined
        };
        it ('returns if digitalTwinId is not specified', () => {
            expect(DigitalTwinService.fetchDigitalTwinInterfaceProperties(parameters)).toEqual(emptyPromise);
        });

        it('calls fetch with specified parameters and returns digitalTwin interfaces when response is 200', async () => {
            jest.spyOn(DataplaneService, 'dataPlaneConnectionHelper').mockReturnValue({
                connectionInfo: getConnectionInfoFromConnectionString(parameters.connectionString), sasToken});
            // tslint:disable
            const digitalTwin = {
                interfaces: {
                    'urn_azureiot_ModelDiscovery_DigitalTwin': {
                        name: 'urn_azureiot_ModelDiscovery_DigitalTwin',
                        properties: {
                            modelInformation:
                                {
                                    reported: {
                                        value:{interfaces: {'urn_azureiot_ModelDiscovery_DigitalTwin':'urn:azureiot:ModelDiscovery:DigitalTwin:1'}
                                    }
                                }
                            }
                        }
                    }
                },
                'version':1
            };
            const response = {
                json: () => {
                    return {
                        body: digitalTwin,
                        headers:{}
                        }
                    },
                status: 200
            } as any;
            // tslint:enable
            jest.spyOn(window, 'fetch').mockResolvedValue(response);

            const result = await DigitalTwinService.fetchDigitalTwinInterfaceProperties({
                ...parameters,
                digitalTwinId: deviceId
            });

            const connectionInformation = mockDataPlaneConnectionHelper({connectionString});
            const dataPlaneRequest: DataplaneService.DataPlaneRequest = {
                apiVersion: DIGITAL_TWIN_API_VERSION,
                hostName: connectionInformation.connectionInfo.hostName,
                httpMethod: HTTP_OPERATION_TYPES.Get,
                path: `/digitalTwins/${deviceId}/interfaces`,
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
            expect(result).toEqual(digitalTwin);
        });

        it('throws Error when promise rejects', async () => {
            window.fetch = jest.fn().mockRejectedValueOnce(new Error('Internal server error'));
            await expect(DigitalTwinService.fetchDigitalTwinInterfaceProperties({
                ...parameters,
                digitalTwinId: deviceId
            })).rejects.toThrow('Internal server error');
        });
    });

    context('invokeDigitalTwinInterfaceCommand', () => {
        const parameters = {
            commandName: 'commandName',
            componentName,
            connectionString,
            digitalTwinId: undefined,
            payload: undefined
        };
        it ('returns if digitalTwinId is not specified', () => {
            expect(DigitalTwinService.invokeDigitalTwinInterfaceCommand(parameters)).toEqual(emptyPromise);
        });

        it('calls fetch with specified parameters and invokes DigitalTwinInterfaceCommand when response is 200', async () => {
            jest.spyOn(DataplaneService, 'dataPlaneConnectionHelper').mockReturnValue({
                connectionInfo: getConnectionInfoFromConnectionString(parameters.connectionString), sasToken});

            // tslint:disable
            const responseBody = {
                description: 'Invoked'
            };
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

            const result = await DigitalTwinService.invokeDigitalTwinInterfaceCommand({
                ...parameters,
                digitalTwinId: deviceId
            });

            const connectionInformation = mockDataPlaneConnectionHelper({connectionString});
            const queryString = `connectTimeoutInSeconds=${CONNECTION_TIMEOUT_IN_SECONDS}&responseTimeoutInSeconds=${RESPONSE_TIME_IN_SECONDS}`;
            const dataPlaneRequest: DataplaneService.DataPlaneRequest = {
                apiVersion: DIGITAL_TWIN_API_VERSION,
                body: JSON.stringify(parameters.payload),
                hostName: connectionInformation.connectionInfo.hostName,
                httpMethod: HTTP_OPERATION_TYPES.Post,
                path: `/digitalTwins/${deviceId}/interfaces/${parameters.componentName}/commands/${parameters.commandName}`,
                queryString,
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
            window.fetch = jest.fn().mockRejectedValueOnce(new Error('Internal server error'));
            await expect(DigitalTwinService.invokeDigitalTwinInterfaceCommand({
                ...parameters,
                digitalTwinId: deviceId
            })).rejects.toThrow('Internal server error');
        });
    });

    context('patchDigitalTwinInterfaceProperties', () => {
        const payload = {
            interfaces: {
                Sensor: {
                    properties: {
                        name: {
                            desired: {
                                value: 123
                            }
                        }
                    }
                }
            }
        };
        const parameters = {
            connectionString,
            digitalTwinId: undefined,
            payload
        };
        it ('returns if digitalTwinId is not specified', () => {
            expect(DigitalTwinService.patchDigitalTwinInterfaceProperties(parameters)).toEqual(emptyPromise);
        });

        it('calls fetch with specified parameters and invokes patchDigitalTwinInterfaceProperties when response is 200', async () => {
            jest.spyOn(DataplaneService, 'dataPlaneConnectionHelper').mockReturnValue({
                connectionInfo: getConnectionInfoFromConnectionString(parameters.connectionString), sasToken});

            // tslint:disable
            const responseBody = {
                ...payload
            };
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

            const result = await DigitalTwinService.patchDigitalTwinInterfaceProperties({
                ...parameters,
                digitalTwinId: deviceId
            });

            const connectionInformation = mockDataPlaneConnectionHelper({connectionString});
            const dataPlaneRequest: DataplaneService.DataPlaneRequest = {
                apiVersion: DIGITAL_TWIN_API_VERSION,
                body: JSON.stringify(parameters.payload),
                hostName: connectionInformation.connectionInfo.hostName,
                httpMethod: HTTP_OPERATION_TYPES.Patch,
                path: `/digitalTwins/${deviceId}/interfaces`,
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

            await expect(DigitalTwinService.patchDigitalTwinInterfaceProperties({
                ...parameters,
                digitalTwinId: deviceId
            })).rejects.toThrow(new Error());
        });
    });
});
