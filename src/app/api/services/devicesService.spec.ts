/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import 'jest';
import * as DevicesService from './devicesService';
import * as DataplaneService from './dataplaneServiceHelper';
import { Twin } from '../models/device';
import { DeviceIdentity } from './../models/deviceIdentity';
import { getConnectionInfoFromConnectionString } from '../shared/utils';
import { MonitorEventsParameters } from '../parameters/deviceParameters';

const deviceId = 'deviceId';
const connectionString = 'HostName=test-string.azure-devices.net;SharedAccessKeyName=owner;SharedAccessKey=fakeKey=';
const connectionInfo = getConnectionInfoFromConnectionString(connectionString);

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

describe('deviceTwinService', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        jest.spyOn(DataplaneService, 'dataPlaneConnectionHelper').mockResolvedValue({
            connectionInfo, connectionString, sasToken});
    });

    context('fetchDeviceTwin', () => {
        it ('returns if deviceId is not specified', () => {
            expect(DevicesService.fetchDeviceTwin({deviceId: undefined})).resolves.toBe(undefined);
        });

        it('calls IPC dataPlaneRequest and returns deviceTwin when response is 200', async () => {
            (window as any).api_device.dataPlaneRequest.mockResolvedValue({
                body: { body: twin },
                statusCode: 200
            });

            const result = await DevicesService.fetchDeviceTwin({deviceId});

            expect((window as any).api_device.dataPlaneRequest).toHaveBeenCalled();
            expect(result).toEqual(twin);
        });

        it('throws Error when IPC rejects', async () => {
            (window as any).api_device.dataPlaneRequest.mockRejectedValue(new Error('Not found'));
            await expect(DevicesService.fetchDeviceTwin({deviceId})).rejects.toThrowError('Not found');
        });
    });

    context('updateDeviceTwin', () => {
        it('calls IPC dataPlaneRequest and invokes updateDeviceTwin when response is 200', async () => {
            (window as any).api_device.dataPlaneRequest.mockResolvedValue({
                body: { body: twin },
                statusCode: 200
            });

            const result = await DevicesService.updateDeviceTwin(twin);

            expect((window as any).api_device.dataPlaneRequest).toHaveBeenCalled();
            expect(result).toEqual(twin);
        });

        it('throws Error when IPC rejects', async () => {
            (window as any).api_device.dataPlaneRequest.mockRejectedValue(new Error());
            await expect(DevicesService.updateDeviceTwin(twin)).rejects.toThrow(new Error());
        });
    });

    context('invokeDirectMethod', () => {
        const parameters = {
            connectTimeoutInSeconds: 10,
            connectionString,
            deviceId: undefined as string,
            methodName: 'methodName',
            payload: {foo: 'bar'},
            responseTimeoutInSeconds : 10,
        };

        it ('returns if deviceId is not specified', () => {
            expect(DevicesService.invokeDirectMethod(parameters)).resolves.toBe(undefined);
        });

        it('calls IPC dataPlaneRequest and invokes invokeDirectMethod when response is 200', async () => {
            const responseBody = {description: 'invoked'};
            (window as any).api_device.dataPlaneRequest.mockResolvedValue({
                body: { body: responseBody },
                statusCode: 200
            });

            const result = await DevicesService.invokeDirectMethod({
                ...parameters,
                deviceId
            });

            expect((window as any).api_device.dataPlaneRequest).toHaveBeenCalled();
            expect(result).toEqual(responseBody);
        });

        it('throws Error when IPC rejects', async () => {
            (window as any).api_device.dataPlaneRequest.mockRejectedValue(new Error());
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

        it('calls IPC dataPlaneRequest with expected parameters', async () => {
            const responseBody = {description: 'sent'};
            (window as any).api_device.dataPlaneRequest.mockResolvedValue({
                body: { body: responseBody },
                statusCode: 200
            });

            const result = await DevicesService.cloudToDeviceMessage({
                ...parameters,
                deviceId
            });

            expect((window as any).api_device.dataPlaneRequest).toHaveBeenCalled();
            expect(result).toEqual(responseBody);
        });
    });

    context('addDevice', () => {
        const parameters = {
            connectionString,
            deviceIdentity: undefined as DeviceIdentity
        };

        it ('returns if deviceIdentity is not specified', () => {
            expect(DevicesService.addDevice(parameters)).resolves.toBe(undefined);
        });

        it('calls IPC dataPlaneRequest and invokes addDevice when response is 200', async () => {
            (window as any).api_device.dataPlaneRequest.mockResolvedValue({
                body: { body: deviceIdentity },
                statusCode: 200
            });

            const result = await DevicesService.addDevice({
                ...parameters,
                deviceIdentity
            });

            expect((window as any).api_device.dataPlaneRequest).toHaveBeenCalled();
            expect(result).toEqual(deviceIdentity);
        });

        it('throws Error when IPC rejects', async () => {
            (window as any).api_device.dataPlaneRequest.mockRejectedValue(new Error());
            await expect(DevicesService.addDevice({
                ...parameters,
                deviceIdentity
            })).rejects.toThrow(new Error());
        });
    });

    context('updateDevice', () => {
        const parameters = {
            connectionString,
            deviceIdentity: undefined as DeviceIdentity
        };

        it ('returns if deviceIdentity is not specified', () => {
            expect(DevicesService.updateDevice(parameters)).resolves.toBe(undefined);
        });

        it('calls IPC dataPlaneRequest and invokes updateDevice when response is 200', async () => {
            (window as any).api_device.dataPlaneRequest.mockResolvedValue({
                body: { body: deviceIdentity },
                statusCode: 200
            });

            const result = await DevicesService.updateDevice({
                ...parameters,
                deviceIdentity
            });

            expect((window as any).api_device.dataPlaneRequest).toHaveBeenCalled();
            expect(result).toEqual(deviceIdentity);
        });

        it('throws Error when IPC rejects', async () => {
            (window as any).api_device.dataPlaneRequest.mockRejectedValue(new Error());
            await expect(DevicesService.updateDevice({
                ...parameters,
                deviceIdentity
            })).rejects.toThrow(new Error());
        });
    });

    context('fetchDevice', () => {
        const parameters = {
            connectionString,
            deviceId: undefined as string
        };

        it ('returns if deviceId is not specified', () => {
            expect(DevicesService.fetchDevice(parameters)).resolves.toBe(undefined);
        });

        it('calls IPC dataPlaneRequest and invokes fetchDevice when response is 200', async () => {
            (window as any).api_device.dataPlaneRequest.mockResolvedValue({
                body: { body: deviceIdentity },
                statusCode: 200
            });

            const result = await DevicesService.fetchDevice({
                ...parameters,
                deviceId
            });

            expect((window as any).api_device.dataPlaneRequest).toHaveBeenCalled();
            expect(result).toEqual(deviceIdentity);
        });

        it('throws Error when IPC rejects', async () => {
            (window as any).api_device.dataPlaneRequest.mockRejectedValue(new Error());
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

        it('calls IPC dataPlaneRequest and invokes fetchDevices when response is 200', async () => {
            (window as any).api_device.dataPlaneRequest.mockResolvedValue({
                body: { body: [deviceIdentity], headers: {foo: 'bar'} },
                statusCode: 200
            });

            const result = await DevicesService.fetchDevices(parameters);

            expect((window as any).api_device.dataPlaneRequest).toHaveBeenCalled();
            expect(result).toEqual({body: [deviceIdentity], headers: {foo: 'bar'}});
        });

        it('throws Error when IPC rejects', async () => {
            (window as any).api_device.dataPlaneRequest.mockRejectedValue(new Error());
            await expect(DevicesService.fetchDevices(parameters)).rejects.toThrow(new Error());
        });
    });

    context('deleteDevices', () => {
        let parameters = {
            connectionString,
            deviceIds: undefined as string[]
        };

        it ('returns if deviceId is not specified', () => {
            expect(DevicesService.deleteDevices(parameters)).resolves.toBe(undefined);
        });

        it('calls IPC dataPlaneRequest and invokes deleteDevices when response is 200', async () => {
            const responseBody = {isSuccessful:true, errors:[], warnings:[]};
            (window as any).api_device.dataPlaneRequest.mockResolvedValue({
                body: { body: responseBody },
                statusCode: 200
            });

            parameters = {
                ...parameters,
                deviceIds: [deviceId]
            };

            const result = await DevicesService.deleteDevices(parameters);

            expect((window as any).api_device.dataPlaneRequest).toHaveBeenCalled();
            expect(result).toEqual(responseBody);
        });

        it('throws Error when response status is 500', async () => {
            (window as any).api_device.dataPlaneRequest.mockResolvedValue({
                body: {},
                statusCode: 500
            });

            await expect(DevicesService.deleteDevices({
                ...parameters,
                deviceIds: [deviceId]
            })).rejects.toThrow(new Error('500'));
        });
    });

    context('monitorEvents', () => {
        const parameters: MonitorEventsParameters = {
            consumerGroup: '$Default',
            customEventHubConnectionString: 'customConnectionString',
            deviceId,
            moduleId: ''
        };

        it('calls IPC startEventHubMonitoring with expected parameters', async () => {
            (window as any).api_device.startEventHubMonitoring.mockResolvedValue(undefined);

            await DevicesService.monitorEvents(parameters);
            expect((window as any).api_device.startEventHubMonitoring).toHaveBeenCalledWith(expect.objectContaining({
                consumerGroup: parameters.consumerGroup,
                customEventHubConnectionString: parameters.customEventHubConnectionString,
                deviceId: parameters.deviceId
            }));
        });

        it('throws Error when IPC rejects', async () => {
            (window as any).api_device.startEventHubMonitoring.mockRejectedValue(new Error());
            await expect(DevicesService.monitorEvents(parameters)).rejects.toThrow(new Error());
        });
    });


    context('stopMonitoringEvents', () => {
        it('calls IPC stopEventHubMonitoring', async () => {
            (window as any).api_device.stopEventHubMonitoring.mockResolvedValue(undefined);

            await DevicesService.stopMonitoringEvents();
            expect((window as any).api_device.stopEventHubMonitoring).toHaveBeenCalled();
        });

        it('throws Error when IPC rejects', async () => {
            (window as any).api_device.stopEventHubMonitoring.mockRejectedValue(new Error());
            await expect(DevicesService.stopMonitoringEvents()).rejects.toThrow(new Error());
        });
    });
});
