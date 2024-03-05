/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { Type } from 'protobufjs';
import {
    CloudToDeviceMessageParameters,
    FetchDeviceTwinParameters,
    InvokeMethodParameters,
    FetchDevicesParameters,
    MonitorEventsParameters,
    FetchDeviceParameters,
    DeleteDevicesParameters,
    AddDeviceParameters,
    UpdateDeviceParameters,
    UpdateDeviceTwinParameters
} from '../parameters/deviceParameters';
import {
    HEADERS,
    HTTP_OPERATION_TYPES,
    HUB_DATA_PLANE_API_VERSION
} from '../../constants/apiConstants';
import { buildQueryString } from '../shared/utils';
import { Message } from '../models/messages';
import { Twin, Device, DataPlaneResponse } from '../models/device';
import { DeviceIdentity } from '../models/deviceIdentity';
import { dataPlaneConnectionHelper, dataPlaneResponseHelper, request, DATAPLANE_CONTROLLER_ENDPOINT, DataPlaneRequest } from './dataplaneServiceHelper';
import { parseEventHubMessage } from './eventHubMessageHelper';
import { AppInsightsClient } from '../../shared/appTelemetry/appInsightsClient';
import { TELEMETRY_EVENTS } from '../../constants/telemetry';
import { startEventHubMonitoring, stopEventHubMonitoring } from '../handlers/eventHubServiceHandler';

const PAGE_SIZE = 100;

export interface IoTHubConnectionSettings {
    hostName?: string;
    sharedAccessKey?: string;
    sharedAccessKeyName?: string;
}

export interface DirectMethodResult {
    payload: object;
    status: number;
}

export const fetchDeviceTwin = async (parameters: FetchDeviceTwinParameters): Promise<Twin> => {
    if (!parameters.deviceId) {
        return;
    }

    const connectionInformation = await dataPlaneConnectionHelper(parameters.connectionString);
    const dataPlaneRequest: DataPlaneRequest = {
        apiVersion: HUB_DATA_PLANE_API_VERSION,
        hostName: connectionInformation.connectionInfo.hostName,
        httpMethod: HTTP_OPERATION_TYPES.Get,
        path: `twins/${parameters.deviceId}`,
        sharedAccessSignature: connectionInformation.sasToken
    };

    const response = await request(DATAPLANE_CONTROLLER_ENDPOINT, dataPlaneRequest);
    const result = await dataPlaneResponseHelper(response);
    return result && result.body;
};

export const updateDeviceTwin = async (parameters: UpdateDeviceTwinParameters): Promise<Twin> => {
    const connectionInformation = await dataPlaneConnectionHelper(parameters.connectionString);
    const dataPlaneRequest: DataPlaneRequest = {
        apiVersion: HUB_DATA_PLANE_API_VERSION,
        body: JSON.stringify(parameters.twin),
        hostName: connectionInformation.connectionInfo.hostName,
        httpMethod: HTTP_OPERATION_TYPES.Patch,
        path: `twins/${parameters.twin.deviceId}`,
        sharedAccessSignature: connectionInformation.sasToken,
    };

    const response = await request(DATAPLANE_CONTROLLER_ENDPOINT, dataPlaneRequest);
    const result = await dataPlaneResponseHelper(response);
    return result && result.body;
};

export const invokeDirectMethod = async (parameters: InvokeMethodParameters): Promise<DirectMethodResult> => {
    if (!parameters.deviceId) {
        return;
    }

    const connectionInfo = await dataPlaneConnectionHelper(parameters.connectionString);
    const dataPlaneRequest: DataPlaneRequest = {
        apiVersion: HUB_DATA_PLANE_API_VERSION,
        body: JSON.stringify({
            connectTimeoutInSeconds: parameters.connectTimeoutInSeconds,
            methodName: parameters.methodName,
            payload: parameters.payload,
            responseTimeoutInSeconds: parameters.responseTimeoutInSeconds,
        }),
        hostName: connectionInfo.connectionInfo.hostName,
        httpMethod: HTTP_OPERATION_TYPES.Post,
        path: `twins/${parameters.deviceId}/methods`,
        sharedAccessSignature: connectionInfo.sasToken,
    };

    const response = await request(DATAPLANE_CONTROLLER_ENDPOINT, dataPlaneRequest);
    const result = await dataPlaneResponseHelper(response);
    return result && result.body;
};

export const cloudToDeviceMessage = async (params: CloudToDeviceMessageParameters) => {
    const { deviceId, body, properties, connectionString } = params;
    const connectionInfo = await dataPlaneConnectionHelper(connectionString);
    const authorization = connectionInfo.sasToken;
    const formattedProperties: Record<string, string> = {};
    properties.forEach(s => formattedProperties[`iothub-app-${s.key}`] = s.value);
    const dataPlaneRequest: DataPlaneRequest = {
        apiVersion: HUB_DATA_PLANE_API_VERSION,
        body,
        headers: {
            ...formattedProperties,
            authorization,
            ['Content-Encoding']: 'utf-8'
        },
        hostName: connectionInfo.connectionInfo.hostName,
        httpMethod: HTTP_OPERATION_TYPES.Post,
        path: `devices/${encodeURIComponent(deviceId)}/messages/deviceBound`,
        sharedAccessSignature: connectionInfo.sasToken,
    };

    const response = await request(DATAPLANE_CONTROLLER_ENDPOINT, dataPlaneRequest);
    const result = await dataPlaneResponseHelper(response);
    return result && result.body;
};

export const addDevice = async (parameters: AddDeviceParameters): Promise<DeviceIdentity> => {
    if (!parameters.deviceIdentity) {
        return;
    }

    const connectionInfo = await dataPlaneConnectionHelper(parameters.connectionString);
    const dataPlaneRequest: DataPlaneRequest = {
        apiVersion: HUB_DATA_PLANE_API_VERSION,
        body: JSON.stringify(parameters.deviceIdentity),
        hostName: connectionInfo.connectionInfo.hostName,
        httpMethod: HTTP_OPERATION_TYPES.Put,
        path: `devices/${parameters.deviceIdentity.deviceId}`,
        sharedAccessSignature: connectionInfo.sasToken
    };

    const response = await request(DATAPLANE_CONTROLLER_ENDPOINT, dataPlaneRequest);
    const result = await dataPlaneResponseHelper(response);
    return result && result.body;
};

export const updateDevice = async (parameters: UpdateDeviceParameters): Promise<DeviceIdentity> => {
    if (!parameters.deviceIdentity) {
        return;
    }

    const connectionInfo = await dataPlaneConnectionHelper(parameters.connectionString);
    const dataPlaneRequest: DataPlaneRequest = {
        apiVersion: HUB_DATA_PLANE_API_VERSION,
        body: JSON.stringify(parameters.deviceIdentity),
        headers: {} as any, // tslint:disable-line: no-any
        hostName: connectionInfo.connectionInfo.hostName,
        httpMethod: HTTP_OPERATION_TYPES.Put,
        path: `devices/${parameters.deviceIdentity.deviceId}`,
        sharedAccessSignature: connectionInfo.sasToken
    };

    (dataPlaneRequest.headers as any)[HEADERS.IF_MATCH] = `"${parameters.deviceIdentity.etag}"`; // tslint:disable-line: no-any

    const response = await request(DATAPLANE_CONTROLLER_ENDPOINT, dataPlaneRequest);
    const result = await dataPlaneResponseHelper(response);
    return result && result.body;
};

export const fetchDevice = async (parameters: FetchDeviceParameters): Promise<DeviceIdentity> => {
    if (!parameters.deviceId) {
        return;
    }

    const connectionInfo = await dataPlaneConnectionHelper(parameters.connectionString);
    const dataPlaneRequest: DataPlaneRequest = {
        apiVersion: HUB_DATA_PLANE_API_VERSION,
        hostName: connectionInfo.connectionInfo.hostName,
        httpMethod: HTTP_OPERATION_TYPES.Get,
        path: `devices/${parameters.deviceId}`,
        sharedAccessSignature: connectionInfo.sasToken
    };

    const response = await request(DATAPLANE_CONTROLLER_ENDPOINT, dataPlaneRequest);
    const result = await dataPlaneResponseHelper(response);
    return result && result.body;
};

// tslint:disable-next-line:cyclomatic-complexity
export const fetchDevices = async (parameters: FetchDevicesParameters): Promise<DataPlaneResponse<Device[]>> => {
    const connectionInformation = await dataPlaneConnectionHelper(parameters.connectionString);
    const queryString = buildQueryString(parameters.query);

    const dataPlaneRequest: DataPlaneRequest = {
        apiVersion: HUB_DATA_PLANE_API_VERSION,
        body: JSON.stringify({
            query: queryString,
        }),
        headers: {} as any, // tslint:disable-line: no-any
        hostName: connectionInformation.connectionInfo.hostName,
        httpMethod: HTTP_OPERATION_TYPES.Post,
        path: 'devices/query',
        sharedAccessSignature: connectionInformation.sasToken,
    };

    (dataPlaneRequest.headers as any)[HEADERS.PAGE_SIZE] = PAGE_SIZE; // tslint:disable-line: no-any

    if (parameters.query && parameters.query.currentPageIndex > 0 && parameters.query.continuationTokens && parameters.query.continuationTokens.length >= parameters.query.currentPageIndex) {
        (dataPlaneRequest.headers as any)[HEADERS.CONTINUATION_TOKEN] = parameters.query.continuationTokens[parameters.query.currentPageIndex]; // tslint:disable-line: no-any
    }

    try {
        const response = await request(DATAPLANE_CONTROLLER_ENDPOINT, dataPlaneRequest);
        AppInsightsClient.getInstance()?.trackEvent({name: TELEMETRY_EVENTS.FETCH_DEVICES}, {status: response.status.toString(), statusText: response.statusText});
        const result = await dataPlaneResponseHelper(response);
        return result;
    } catch (e) {
        AppInsightsClient.getInstance()?.trackEvent({name: TELEMETRY_EVENTS.FETCH_DEVICES}, {status: 'N/A', statusText: e.toString()});
        throw (e);
    }
};

export const deleteDevices = async (parameters: DeleteDevicesParameters) => {
    if (!parameters.deviceIds) {
        return;
    }

    const deviceDeletionInstructions = parameters.deviceIds.map(deviceId => (
        {
            etag: '*',
            id: deviceId,
            importMode: 'deleteIfMatchEtag'
        }
    ));

    const connectionInfo = await dataPlaneConnectionHelper(parameters.connectionString);
    const dataPlaneRequest: DataPlaneRequest = {
        apiVersion: HUB_DATA_PLANE_API_VERSION,
        body: JSON.stringify(deviceDeletionInstructions),
        hostName: connectionInfo.connectionInfo.hostName,
        httpMethod: HTTP_OPERATION_TYPES.Post,
        path: `devices`,
        sharedAccessSignature: connectionInfo.sasToken,
    };

    const response = await request(DATAPLANE_CONTROLLER_ENDPOINT, dataPlaneRequest);
    const result = await dataPlaneResponseHelper(response);
    return result && result.body;
};

export const monitorEvents = async (parameters: MonitorEventsParameters): Promise<void> => {
    const requestParameters = {
        ...parameters,
        startTime: parameters.startTime && parameters.startTime.toISOString()
    };

    await startEventHubMonitoring(requestParameters);
};

export const parseEvents = async (params: {messages: Message[], decoderPrototype?: Type}): Promise<Message[]> => {
    const { messages, decoderPrototype } = params;
    return Promise.all(messages?.map(message => parseEventHubMessage(message, decoderPrototype)) || []);
};

export const stopMonitoringEvents = async (): Promise<void> => {
    await stopEventHubMonitoring();
};
