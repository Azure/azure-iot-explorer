/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import {
    FetchDeviceTwinParameters,
    UpdateDeviceTwinParameters,
    InvokeMethodParameters,
    FetchDevicesParameters,
    MonitorEventsParameters,
    FetchDeviceParameters,
    DeleteDevicesParameters,
    AddDeviceParameters,
    UpdateDeviceParameters,
    FetchDigitalTwinInterfacePropertiesParameters,
    InvokeDigitalTwinInterfaceCommandParameters,
    PatchDigitalTwinInterfacePropertiesParameters,
    CloudToDeviceMessageParameters
} from '../parameters/deviceParameters';
import { CONTROLLER_API_ENDPOINT,
    EVENTHUB,
    DIGITAL_TWIN_API_VERSION,
    HUB_DATA_PLANE_API_VERSION,
    MONITOR,
    STOP,
    HEADERS,
    CLOUD_TO_DEVICE,
    DataPlaneStatusCode
} from '../../constants/apiConstants';
import { HTTP_OPERATION_TYPES } from '../constants';
import { buildQueryString } from '../shared/utils';
import { CONNECTION_TIMEOUT_IN_SECONDS, RESPONSE_TIME_IN_SECONDS } from '../../constants/devices';
import { Message } from '../models/messages';
import { Twin, Device, DataPlaneResponse } from '../models/device';
import { DeviceIdentity } from '../models/deviceIdentity';
import { DigitalTwinInterfaces } from '../models/digitalTwinModels';
import { parseEventHubMessage } from './eventHubMessageHelper';
import { dataPlaneConnectionHelper, dataPlaneResponseHelper, request, DATAPLANE_CONTROLLER_ENDPOINT, DataPlaneRequest } from './dataplaneServiceHelper';

const EVENTHUB_CONTROLLER_ENDPOINT = `${CONTROLLER_API_ENDPOINT}${EVENTHUB}`;
export const EVENTHUB_MONITOR_ENDPOINT = `${EVENTHUB_CONTROLLER_ENDPOINT}${MONITOR}`;
export const EVENTHUB_STOP_ENDPOINT = `${EVENTHUB_CONTROLLER_ENDPOINT}${STOP}`;
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
    try {
        if (!parameters.deviceId) {
            return;
        }

        const connectionInformation = dataPlaneConnectionHelper(parameters);
        const dataPlaneRequest: DataPlaneRequest = {
            apiVersion: HUB_DATA_PLANE_API_VERSION,
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

export const updateDeviceTwin = async (parameters: UpdateDeviceTwinParameters): Promise<Twin> => {
    try {
        if (!parameters.deviceId) {
            return;
        }

        const connectionInformation = dataPlaneConnectionHelper(parameters);
        const dataPlaneRequest: DataPlaneRequest = {
            apiVersion: HUB_DATA_PLANE_API_VERSION,
            body: JSON.stringify(parameters.deviceTwin),
            hostName: connectionInformation.connectionInfo.hostName,
            httpMethod: HTTP_OPERATION_TYPES.Patch,
            path: `twins/${parameters.deviceId}`,
            sharedAccessSignature: connectionInformation.sasToken,
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
export const invokeDigitalTwinInterfaceCommand = async (parameters: InvokeDigitalTwinInterfaceCommandParameters): Promise<any> => {
    try {
        if (!parameters.digitalTwinId) {
            return;
        }

        const connectionInformation = dataPlaneConnectionHelper(parameters);
        const connectTimeoutInSeconds = parameters.connectTimeoutInSeconds || CONNECTION_TIMEOUT_IN_SECONDS;
        const responseTimeoutInSeconds = parameters.responseTimeoutInSeconds || RESPONSE_TIME_IN_SECONDS;
        const queryString = `connectTimeoutInSeconds=${connectTimeoutInSeconds}&responseTimeoutInSeconds=${responseTimeoutInSeconds}`;
        const dataPlaneRequest: DataPlaneRequest = {
            apiVersion: DIGITAL_TWIN_API_VERSION,
            body: JSON.stringify(parameters.payload),
            hostName: connectionInformation.connectionInfo.hostName,
            httpMethod: HTTP_OPERATION_TYPES.Post,
            path: `/digitalTwins/${parameters.digitalTwinId}/interfaces/${parameters.componentName}/commands/${parameters.commandName}`,
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
        return result.body;
    } catch (error) {
        throw error;
    }
};

export const invokeDirectMethod = async (parameters: InvokeMethodParameters): Promise<DirectMethodResult> => {
    try {
        if (!parameters.deviceId) {
            return;
        }

        const connectionInfo = dataPlaneConnectionHelper(parameters);
        const dataPlaneRequest: DataPlaneRequest = {
            apiVersion:  HUB_DATA_PLANE_API_VERSION,
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
        return result.body;
    } catch (error) {
        throw error;
    }
};

export const cloudToDeviceMessage = async (parameters: CloudToDeviceMessageParameters) => {
    try {
        const cloudToDeviceRequest = {
            ...parameters
        };
        const response = await request(`${CONTROLLER_API_ENDPOINT}${CLOUD_TO_DEVICE}`, cloudToDeviceRequest);
        await dataPlaneResponseHelper(response);
    } catch (error) {
        throw error;
    }
};

export const addDevice = async (parameters: AddDeviceParameters): Promise<DeviceIdentity> => {
    try {
        if (!parameters.deviceIdentity) {
            return;
        }

        const connectionInfo = dataPlaneConnectionHelper(parameters);
        const dataPlaneRequest: DataPlaneRequest = {
            apiVersion:  HUB_DATA_PLANE_API_VERSION,
            body: JSON.stringify(parameters.deviceIdentity),
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

export const updateDevice = async (parameters: UpdateDeviceParameters): Promise<DeviceIdentity> => {
    try {
        if (!parameters.deviceIdentity) {
            return;
        }

        const connectionInfo = dataPlaneConnectionHelper(parameters);
        const dataPlaneRequest: DataPlaneRequest = {
            apiVersion:  HUB_DATA_PLANE_API_VERSION,
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
            apiVersion:  HUB_DATA_PLANE_API_VERSION,
            hostName: connectionInfo.connectionInfo.hostName,
            httpMethod: HTTP_OPERATION_TYPES.Get,
            path: `devices/${parameters.deviceId}`,
            sharedAccessSignature: connectionInfo.sasToken
        };

        const response = await request(DATAPLANE_CONTROLLER_ENDPOINT, dataPlaneRequest);
        const result = await dataPlaneResponseHelper(response);
        return result.body;
    } catch (error) {
        throw error;
    }
};

// tslint:disable-next-line: cyclomatic-complexity
export const fetchDevices = async (parameters: FetchDevicesParameters): Promise<DataPlaneResponse<Device[]>> => {
    try {
        const connectionInformation = dataPlaneConnectionHelper(parameters);
        const queryString = buildQueryString(parameters.query);

        const dataPlaneRequest: DataPlaneRequest = {
            apiVersion:  HUB_DATA_PLANE_API_VERSION,
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

        const response = await request(DATAPLANE_CONTROLLER_ENDPOINT, dataPlaneRequest);
        const result = await dataPlaneResponseHelper(response);
        return result;
    } catch (error) {
        throw error;
    }
};

export const deleteDevices = async (parameters: DeleteDevicesParameters) => {
    if (!parameters.deviceIds) {
        return;
    }

    try {
        const deviceDeletionInstructions = parameters.deviceIds.map(deviceId => (
            {
                etag: '*',
                id: deviceId,
                importMode: 'deleteIfMatchEtag'
            }
        ));

        const connectionInfo = dataPlaneConnectionHelper(parameters);
        const dataPlaneRequest: DataPlaneRequest = {
            apiVersion:  HUB_DATA_PLANE_API_VERSION,
            body: JSON.stringify(deviceDeletionInstructions),
            hostName: connectionInfo.connectionInfo.hostName,
            httpMethod: HTTP_OPERATION_TYPES.Post,
            path: `devices`,
            sharedAccessSignature: connectionInfo.sasToken,
        };

        const response = await request(DATAPLANE_CONTROLLER_ENDPOINT, dataPlaneRequest);
        const result = await dataPlaneResponseHelper(response);
        return result.body;
    } catch (error) {
        throw error;
    }
};

// tslint:disable-next-line:cyclomatic-complexity
export const monitorEvents = async (parameters: MonitorEventsParameters): Promise<Message[]> => {
    if (!parameters.hubConnectionString && (!parameters.customEventHubConnectionString || !parameters.customEventHubName)) {
        return;
    }

    const requestParameters = {
        ...parameters,
        startTime: parameters.startTime && parameters.startTime.toISOString()
    };

    const response = await request(EVENTHUB_MONITOR_ENDPOINT, requestParameters);
    if (response.status === DataPlaneStatusCode.SuccessLowerBound) {
        const messages = await response.json() as Message[];
        return  messages && messages.length && messages.length !== 0 && messages.map(message => parseEventHubMessage(message)) || [];
    }
    else {
        const error = await response.json();
        throw new Error(error && error.name);
    }
};

export const stopMonitoringEvents = async (): Promise<void> => {
    try {
        await request(EVENTHUB_STOP_ENDPOINT, {});
    } catch (error) {
        throw error;
    }
};
