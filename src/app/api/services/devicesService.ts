/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
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
    PatchDigitalTwinInterfacePropertiesParameters,
    CloudToDeviceMessageParameters,
    FetchModuleIdentitiesParameters,
    AddModuleIdentityParameters } from '../parameters/deviceParameters';
import { CONTROLLER_API_ENDPOINT, DATAPLANE, EVENTHUB, DIGITAL_TWIN_API_VERSION, DataPlaneStatusCode, MONITOR, STOP, HEADERS, CLOUD_TO_DEVICE } from '../../constants/apiConstants';
import { HTTP_OPERATION_TYPES } from '../constants';
import { buildQueryString, getConnectionInfoFromConnectionString, generateSasToken } from '../shared/utils';
import { CONNECTION_TIMEOUT_IN_SECONDS, RESPONSE_TIME_IN_SECONDS } from '../../constants/devices';
import { Message } from '../models/messages';
import { Twin, Device, DataPlaneResponse } from '../models/device';
import { DeviceIdentity } from '../models/deviceIdentity';
import { DigitalTwinInterfaces } from '../models/digitalTwinModels';
import { ModuleIdentity } from './../models/moduleIdentity';
import { parseEventHubMessage } from './eventHubMessageHelper';

export const DATAPLANE_CONTROLLER_ENDPOINT = `${CONTROLLER_API_ENDPOINT}${DATAPLANE}`;
const EVENTHUB_CONTROLLER_ENDPOINT = `${CONTROLLER_API_ENDPOINT}${EVENTHUB}`;
export const EVENTHUB_MONITOR_ENDPOINT = `${EVENTHUB_CONTROLLER_ENDPOINT}${MONITOR}`;
export const EVENTHUB_STOP_ENDPOINT = `${EVENTHUB_CONTROLLER_ENDPOINT}${STOP}`;
const PAGE_SIZE = 100;

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

export interface DirectMethodResult {
    payload: object;
    status: number;
}

// We can do something more sophisticated with agents and a factory
export const request = async (endpoint: string, parameters: any) => { // tslint:disable-line
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

export const dataPlaneConnectionHelper = (parameters: DataPlaneParameters) => {
    if (!parameters || !parameters.connectionString) {
        return;
    }

    const connectionInfo = getConnectionInfoFromConnectionString(parameters.connectionString);
    if (!(connectionInfo && connectionInfo.hostName)) {
        return;
    }

    const fullHostName = `${connectionInfo.hostName}/devices/query`;
    const sasToken = generateSasToken({
        key: connectionInfo.sharedAccessKey,
        keyName: connectionInfo.sharedAccessKeyName,
        resourceUri: fullHostName
    });

    return {
        connectionInfo,
        sasToken,
    };
};

// tslint:disable-next-line:cyclomatic-complexity
const dataPlaneResponseHelper = async (response: Response) => {
    const dataPlaneResponse = await response;

    let result;
    try {
        result = await response.json();
    }
    catch {
        throw new Error();
    }

    // success case
    if (DataPlaneStatusCode.SuccessLowerBound <= dataPlaneResponse.status && dataPlaneResponse.status <= DataPlaneStatusCode.SuccessUpperBound) {
        return result;
    }

    // error case
    if (result && result.body) {
        if (result.body.Message || result.body.ExceptionMessage) {
            throw new Error(result.body.Message || result.body.ExceptionMessage);
        }
    }

    // error case
    if (result && result.message) {
        throw new Error(result.message);
    }

    throw new Error();
};

export const fetchDeviceTwin = async (parameters: FetchDeviceTwinParameters): Promise<Twin> => {
    try {
        if (!parameters.deviceId) {
            return;
        }

        const connectionInformation = dataPlaneConnectionHelper(parameters);
        const dataPlaneRequest: DataPlaneRequest = {
            apiVersion: DIGITAL_TWIN_API_VERSION,
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
            apiVersion: DIGITAL_TWIN_API_VERSION,
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

export const invokeDirectMethod = async (parameters: InvokeMethodParameters): Promise<DirectMethodResult> => {
    try {
        if (!parameters.deviceId) {
            return;
        }

        const connectionInfo = dataPlaneConnectionHelper(parameters);
        const dataPlaneRequest: DataPlaneRequest = {
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
        // tslint:disable-next-line:no-console
        console.log('herere wew areaealdfkjas;ldfjkasdl;fkjas;dlfkj;lasdkfj;laskdfj;laskdjfl;ksajdf');
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
        const messages = await response.json() as Message[];
        return  messages && messages.length !== 0 && messages.map(message => parseEventHubMessage(message)) || [];
    } catch (error) {
        throw error;
    }
};

export const stopMonitoringEvents = async (): Promise<void> => {
    try {
        await request(EVENTHUB_STOP_ENDPOINT, {});
    } catch (error) {
        throw error;
    }
};

export const fetchModuleIdentities = async (parameters: FetchModuleIdentitiesParameters): Promise<DataPlaneResponse<ModuleIdentity[]>> => {
    try {
        const connectionInformation = dataPlaneConnectionHelper(parameters);

        const dataPlaneRequest: DataPlaneRequest = {
            hostName: connectionInformation.connectionInfo.hostName,
            httpMethod: HTTP_OPERATION_TYPES.Get,
            path: `devices/${parameters.deviceId}/modules`,
            sharedAccessSignature: connectionInformation.sasToken,
        };

        const response = await request(DATAPLANE_CONTROLLER_ENDPOINT, dataPlaneRequest);
        const result = await dataPlaneResponseHelper(response);
        return result.body;
    } catch (error) {
        throw error;
    }
};

export const addModuleIdentity = async (parameters: AddModuleIdentityParameters): Promise<DataPlaneResponse<ModuleIdentity>> => {
    try {
        const connectionInformation = dataPlaneConnectionHelper(parameters);

        const dataPlaneRequest: DataPlaneRequest = {
            body: JSON.stringify(parameters.moduleIdentity),
            hostName: connectionInformation.connectionInfo.hostName,
            httpMethod: HTTP_OPERATION_TYPES.Put,
            path: `devices/${parameters.moduleIdentity.deviceId}/modules/${parameters.moduleIdentity.moduleId}`,
            sharedAccessSignature: connectionInformation.sasToken,
        };

        const response = await request(DATAPLANE_CONTROLLER_ENDPOINT, dataPlaneRequest);
        const result = await dataPlaneResponseHelper(response);
        return result.body;
    } catch (error) {
        throw error;
    }
};
