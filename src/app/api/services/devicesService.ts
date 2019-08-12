/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { BulkRegistryOperationResult } from './../models/bulkRegistryOperationResult';
import { FetchDeviceTwinParameters,
    UpdateDeviceTwinParameters,
    InvokeMethodParameters,
    FetchDevicesParameters,
    MonitorEventsParameters,
    DataPlaneParameters,
    FetchDeviceParameters,
    DeleteDevicesParameters,
    AddDeviceParameters,
    UpdateDeviceParameters,
    FetchDigitalTwinInterfacePropertiesParameters,
    InvokeDigitalTwinInterfaceCommandParameters,
    PatchDigitalTwinInterfacePropertiesParameters } from '../parameters/deviceParameters';
import { CONTROLLER_API_ENDPOINT, DATAPLANE, EVENTHUB, DIGITAL_TWIN_API_VERSION, DataPlaneStatusCode, MONITOR, STOP, HEADERS } from '../../constants/apiConstants';
import { HTTP_OPERATION_TYPES } from '../constants';
import { buildQueryString, getConnectionInfoFromConnectionString, generateSasToken } from '../shared/utils';
import { CONNECTION_TIMEOUT_IN_SECONDS, RESPONSE_TIME_IN_SECONDS } from '../../constants/devices';
import { Message } from '../models/messages';
import { Twin, Device, DataPlaneResponse } from '../models/device';
import { DeviceIdentity } from '../models/deviceIdentity';
import { DeviceSummary } from '../models/deviceSummary';
import { DigitalTwinInterfaces } from '../models/digitalTwinModels';
import { transformDevice, transformDeviceIdentity } from '../dataTransforms/deviceSummaryTransform';

const DATAPLANE_CONTROLLER_ENDPOINT = `${CONTROLLER_API_ENDPOINT}${DATAPLANE}`;
const EVENTHUB_CONTROLLER_ENDPOINT = `${CONTROLLER_API_ENDPOINT}${EVENTHUB}`;
const EVENTHUB_MONITOR_ENDPOINT = `${EVENTHUB_CONTROLLER_ENDPOINT}${MONITOR}`;
const EVENTHUB_STOP_ENDPOINT = `${EVENTHUB_CONTROLLER_ENDPOINT}${STOP}`;
const PAGE_SIZE = 20;

export interface DataPlaneRequest {
    apiVersion?: string;
    body?: string;
    etag?: string;
    headers?: unknown;
    hostName: string;
    httpMethod: string;
    path: string;
    sharedAccessSignature: string;
    queryString?: string;
}

export interface IoTHubConnectionSettings {
    hostName?: string;
    sharedAccessKey?: string;
    sharedAccessKeyName?: string;
}

export interface CloudToDeviceMethodResult {
    payload: object;
    status: number;
}

// We can do something more sophisticated with agents and a factory
const request = async (endpoint: string, parameters: any) => { // tslint:disable-line
    return fetch(
        endpoint,
        {
            body: JSON.stringify(parameters),
            cache: 'no-cache',
            credentials: 'include',
            headers: new Headers({
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            }),
            method: HTTP_OPERATION_TYPES.Post,
            mode: 'cors',
        }
    );
};

const dataPlaneConnectionHelper = (parameters: DataPlaneParameters) => {
    if (!parameters || !parameters.connectionString) {
        return;
    }

    const connectionInfo = getConnectionInfoFromConnectionString(parameters.connectionString);
    if (!(connectionInfo && connectionInfo.hostName)) {
        return;
    }

    const fullHostName = `${connectionInfo.hostName}/devices/query`;
    const sasToken = generateSasToken(fullHostName, connectionInfo.sharedAccessKeyName, connectionInfo.sharedAccessKey);

    return {
        connectionInfo,
        sasToken,
    };
};

// tslint:disable-next-line:cyclomatic-complexity
const dataPlaneResponseHelper = async (response: Response) => {
    const dataPlaneResponse = await response;
    const result = await response.json();

    // success case
    if (DataPlaneStatusCode.SuccessLowerBound <= dataPlaneResponse.status && dataPlaneResponse.status <= DataPlaneStatusCode.SuccessUpperBound) {
        return result;
    }

    // error case
    if (!result || !result) {
        throw new Error();
    }
    if (result.ExceptionMessage && result.Message) {
        throw new Error(`${result.Message}: ${result.ExceptionMessage}`);
    }
    else if (!!result.ExceptionMessage || result.Message) {
        throw new Error(!!result.ExceptionMessage ? result.ExceptionMessage : result.Message);
    }

    throw new Error(result);
};

export const fetchDeviceTwin = async (parameters: FetchDeviceTwinParameters): Promise<DataPlaneResponse<Twin>> => {
    try {
        if (!parameters.deviceId) {
            return;
        }

        const connectionInformation = dataPlaneConnectionHelper(parameters);
        const dataPlaneRequest: DataPlaneRequest = {
            hostName: connectionInformation.connectionInfo.hostName,
            httpMethod: HTTP_OPERATION_TYPES.Get,
            path: `twins/${parameters.deviceId}`,
            sharedAccessSignature: connectionInformation.sasToken
        };

        const response = await request(DATAPLANE_CONTROLLER_ENDPOINT, dataPlaneRequest);
        const result = await dataPlaneResponseHelper(response);
        return result.body;
    } catch (error) {
        throw error;
    }
};

export const fetchDigitalTwinInterfaceProperties = async (parameters: FetchDigitalTwinInterfacePropertiesParameters): Promise<DigitalTwinInterfaces> => {
    try {
        if (!parameters.digitalTwinId) {
            return;
        }

        const connectionInformation = dataPlaneConnectionHelper(parameters);
        const dataPlaneRequest: DataPlaneRequest = {
            apiVersion: DIGITAL_TWIN_API_VERSION,
            hostName: connectionInformation.connectionInfo.hostName,
            httpMethod: HTTP_OPERATION_TYPES.Get,
            path: `/digitalTwins/${parameters.digitalTwinId}/interfaces`,
            sharedAccessSignature: connectionInformation.sasToken
        };

        const response = await request(DATAPLANE_CONTROLLER_ENDPOINT, dataPlaneRequest);
        const result = await dataPlaneResponseHelper(response);
        return result.body;
    } catch (error) {
        throw error;
    }
};

// tslint:disable-next-line:no-any
export const invokeDigitalTwinInterfaceCommand = async (parameters: InvokeDigitalTwinInterfaceCommandParameters): Promise<DataPlaneResponse<any>> => {
    try {
        if (!parameters.digitalTwinId) {
            return;
        }

        const connectionInformation = dataPlaneConnectionHelper(parameters);
        const connectTimeoutInSeconds = parameters.connectTimeoutInSeconds || CONNECTION_TIMEOUT_IN_SECONDS;
        const responseTimeInSeconds = parameters.responseTimeoutInSeconds || RESPONSE_TIME_IN_SECONDS;
        const queryString = `connectTimeoutInSeconds=${connectTimeoutInSeconds}&responseTimeInSeconds=${responseTimeInSeconds}`;
        const dataPlaneRequest: DataPlaneRequest = {
            apiVersion: DIGITAL_TWIN_API_VERSION,
            body: JSON.stringify(parameters.payload),
            hostName: connectionInformation.connectionInfo.hostName,
            httpMethod: HTTP_OPERATION_TYPES.Post,
            path: `/digitalTwins/${parameters.digitalTwinId}/interfaces/${parameters.interfaceName}/commands/${parameters.commandName}`,
            queryString,
            sharedAccessSignature: connectionInformation.sasToken
        };

        const response = await request(DATAPLANE_CONTROLLER_ENDPOINT, dataPlaneRequest);
        const result = await dataPlaneResponseHelper(response);
        return result.body;
    } catch (error) {
        throw error;
    }
};

export const patchDigitalTwinInterfaceProperties = async (parameters: PatchDigitalTwinInterfacePropertiesParameters): Promise<DigitalTwinInterfaces> => {
    try {
        if (!parameters.digitalTwinId) {
            return;
        }

        const connectionInformation = dataPlaneConnectionHelper(parameters);
        const dataPlaneRequest: DataPlaneRequest = {
            apiVersion: DIGITAL_TWIN_API_VERSION,
            body: JSON.stringify(parameters.payload),
            hostName: connectionInformation.connectionInfo.hostName,
            httpMethod: HTTP_OPERATION_TYPES.Patch,
            path: `/digitalTwins/${parameters.digitalTwinId}/interfaces`,
            sharedAccessSignature: connectionInformation.sasToken
        };

        const response = await request(DATAPLANE_CONTROLLER_ENDPOINT, dataPlaneRequest);
        const result = await dataPlaneResponseHelper(response);
        return (result as DataPlaneResponse<DigitalTwinInterfaces>).body;
    } catch (error) {
        throw error;
    }
};

export const updateDeviceTwin = async (parameters: UpdateDeviceTwinParameters): Promise<Twin> => {
    try {
        if (!parameters.deviceId) {
            return;
        }

        const connectionInformation = dataPlaneConnectionHelper(parameters);
        const dataPlaneRequest: DataPlaneRequest = {
            body: JSON.stringify(parameters.deviceTwin),
            hostName: connectionInformation.connectionInfo.hostName,
            httpMethod: HTTP_OPERATION_TYPES.Patch,
            path: `twins/${parameters.deviceId}`,
            sharedAccessSignature: connectionInformation.sasToken,
        };

        const response = await request(DATAPLANE_CONTROLLER_ENDPOINT, dataPlaneRequest);
        const result = await dataPlaneResponseHelper(response);
        return (result as DataPlaneResponse<Twin>).body;
    } catch (error) {
        throw error;
    }
};

export const invokeDeviceMethod = async (parameters: InvokeMethodParameters): Promise<CloudToDeviceMethodResult> => {
    try {
        if (!parameters.deviceId) {
            return;
        }

        const connectionInfo = dataPlaneConnectionHelper(parameters);
        const dataPlaneRequest: DataPlaneRequest = {
            body: JSON.stringify({
                connectTimeoutInSeconds: parameters.connectTimeoutInSeconds || CONNECTION_TIMEOUT_IN_SECONDS,
                methodName: parameters.methodName,
                payload: parameters.payload,
                responseTimeInSeconds: parameters.responseTimeoutInSeconds || RESPONSE_TIME_IN_SECONDS,
            }),
            hostName: connectionInfo.connectionInfo.hostName,
            httpMethod: HTTP_OPERATION_TYPES.Post,
            path: `twins/${parameters.deviceId}/methods`,
            sharedAccessSignature: connectionInfo.sasToken,
        };

        const response = await request(DATAPLANE_CONTROLLER_ENDPOINT, dataPlaneRequest);
        const result = await dataPlaneResponseHelper(response);
        return (result as DataPlaneResponse<CloudToDeviceMethodResult>).body;
    } catch (error) {
        throw error;
    }
};

export const addDevice = async (parameters: AddDeviceParameters): Promise<DeviceSummary> => {
    try {
        if (!parameters.deviceIdentity) {
            return;
        }

        const connectionInfo = dataPlaneConnectionHelper(parameters);
        const dataPlaneRequest: DataPlaneRequest = {
            body: JSON.stringify(parameters.deviceIdentity),
            hostName: connectionInfo.connectionInfo.hostName,
            httpMethod: HTTP_OPERATION_TYPES.Put,
            path: `devices/${parameters.deviceIdentity.deviceId}`,
            sharedAccessSignature: connectionInfo.sasToken
        };

        const response = await request(DATAPLANE_CONTROLLER_ENDPOINT, dataPlaneRequest);
        const result = await dataPlaneResponseHelper(response);
        return transformDeviceIdentity(result.body);
    } catch (error) {
        throw error;
    }
};

export const updateDevice = async (parameters: UpdateDeviceParameters): Promise<DeviceIdentity> => {
    try {
        if (!parameters.deviceIdentity) {
            return;
        }

        const connectionInfo = dataPlaneConnectionHelper(parameters);
        const dataPlaneRequest: DataPlaneRequest = {
            body: JSON.stringify(parameters.deviceIdentity),
            etag: parameters.deviceIdentity.etag,
            hostName: connectionInfo.connectionInfo.hostName,
            httpMethod: HTTP_OPERATION_TYPES.Put,
            path: `devices/${parameters.deviceIdentity.deviceId}`,
            sharedAccessSignature: connectionInfo.sasToken
        };

        const response = await request(DATAPLANE_CONTROLLER_ENDPOINT, dataPlaneRequest);
        const result = await dataPlaneResponseHelper(response);
        return result.body;
    } catch (error) {
        throw error;
    }
};

export const fetchDevice = async (parameters: FetchDeviceParameters): Promise<DeviceIdentity> => {
    try {
        if (!parameters.deviceId) {
            return;
        }

        const connectionInfo = dataPlaneConnectionHelper(parameters);
        const dataPlaneRequest: DataPlaneRequest = {
            hostName: connectionInfo.connectionInfo.hostName,
            httpMethod: HTTP_OPERATION_TYPES.Get,
            path: `devices/${parameters.deviceId}`,
            sharedAccessSignature: connectionInfo.sasToken
        };

        const response = await request(DATAPLANE_CONTROLLER_ENDPOINT, dataPlaneRequest);
        const result = await dataPlaneResponseHelper(response);
        return (result as DataPlaneResponse<DeviceIdentity>).body;
    } catch (error) {
        throw error;
    }
};

export const fetchDevices = async (parameters: FetchDevicesParameters): Promise<DataPlaneResponse<Device>> => {
    try {
        const connectionInformation = dataPlaneConnectionHelper(parameters);
        const queryString = buildQueryString(parameters.query);

        const dataPlaneRequest: DataPlaneRequest = {
            body: JSON.stringify({
                query: queryString
            }),
            headers: {} as any, // tslint:disable-line: no-any
            hostName: connectionInformation.connectionInfo.hostName,
            httpMethod: HTTP_OPERATION_TYPES.Post,
            path: 'devices/query',
            sharedAccessSignature: connectionInformation.sasToken,
        };

        (dataPlaneRequest.headers as any)[HEADERS.PAGE_SIZE] = PAGE_SIZE; // tslint:disable-line

        if (parameters.query && parameters.query.currentPageIndex > 0 && parameters.query.continuationTokens && parameters.query.continuationTokens.length >= parameters.query.currentPageIndex) {
            (dataPlaneRequest.headers as any)[HEADERS.CONTINUATION_TOKEN] = parameters.query.continuationTokens[parameters.query.currentPageIndex]; // tslint:disable-line: no-any
        }
        const response = await request(DATAPLANE_CONTROLLER_ENDPOINT, dataPlaneRequest);
        const result = await dataPlaneResponseHelper(response);
        return result as DataPlaneResponse<Device>;
    } catch (error) {
        throw error;
    }
};

export const deleteDevices = async (parameters: DeleteDevicesParameters) => {
    if (!parameters.deviceIds) {
        return;
    }

    try {
        const deviceDeletionInstructions = parameters.deviceIds.map(deviceId => {
            return {
                etag: '*',
                id: deviceId,
                importMode: 'deleteIfMatchEtag'
            };
        });

        const connectionInfo = dataPlaneConnectionHelper(parameters);
        const dataPlaneRequest: DataPlaneRequest = {
            body: JSON.stringify(deviceDeletionInstructions),
            hostName: connectionInfo.connectionInfo.hostName,
            httpMethod: 'post',
            path: `devices`,
            sharedAccessSignature: connectionInfo.sasToken,
        };

        const response = await request(DATAPLANE_CONTROLLER_ENDPOINT, dataPlaneRequest);
        const result = await dataPlaneResponseHelper(response);
        return result as DataPlaneResponse<BulkRegistryOperationResult[]>;
    } catch (error) {
        throw error;
    }
};

export const monitorEvents = async (parameters: MonitorEventsParameters): Promise<Message[]> => {
    try {
        if (!parameters.hubConnectionString) {
            return;
        }

        const requestParameters = {
            connectionString: parameters.hubConnectionString,
            consumerGroup: parameters.consumerGroup,
            deviceId: parameters.deviceId,
            fetchSystemProperties: parameters.fetchSystemProperties,
            startTime: parameters.startTime && parameters.startTime.toISOString()
        };

        const response = await request(EVENTHUB_MONITOR_ENDPOINT, requestParameters);
        return await response.json() as Message[];
    } catch (error) {
        throw error;
    }
};

export const stopMonitoringEvents = async (): Promise<void> => {
    try {
        const response = await request(EVENTHUB_STOP_ENDPOINT, {});
    } catch (error) {
        throw error;
    }
};
