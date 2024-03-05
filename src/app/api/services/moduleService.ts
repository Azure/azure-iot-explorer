/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import {
    FetchModuleIdentitiesParameters,
    AddModuleIdentityParameters,
    ModuleIdentityTwinParameters,
    FetchModuleIdentityParameters,
    InvokeModuleMethodParameters
} from '../parameters/moduleParameters';
import { DataPlaneResponse } from '../models/device';
import { ModuleIdentity } from '../models/moduleIdentity';
import { ModuleTwin } from '../models/moduleTwin';
import { dataPlaneConnectionHelper, dataPlaneResponseHelper, request, DATAPLANE_CONTROLLER_ENDPOINT, DataPlaneRequest } from './dataplaneServiceHelper';
import { HEADERS, HTTP_OPERATION_TYPES, HUB_DATA_PLANE_API_VERSION } from '../../constants/apiConstants';

export interface IoTHubConnectionSettings {
    hostName?: string;
    sharedAccessKey?: string;
    sharedAccessKeyName?: string;
}

export interface DirectMethodResult {
    payload: object;
    status: number;
}

export const fetchModuleIdentities = async (parameters: FetchModuleIdentitiesParameters): Promise<DataPlaneResponse<ModuleIdentity[]>> => {
    const connectionInformation = await dataPlaneConnectionHelper('todo');

    const dataPlaneRequest: DataPlaneRequest = {
        apiVersion:  HUB_DATA_PLANE_API_VERSION,
        body: JSON.stringify({
            query: `SELECT * FROM devices.modules WHERE deviceId in ['${parameters.deviceId}']`,
        }),
        hostName: connectionInformation.connectionInfo.hostName,
        httpMethod: HTTP_OPERATION_TYPES.Post,
        path: 'devices/query',
        sharedAccessSignature: connectionInformation.sasToken,
    };

    const response = await request(DATAPLANE_CONTROLLER_ENDPOINT, dataPlaneRequest);
    const result = await dataPlaneResponseHelper(response);
    return result && result.body;
};

export const addModuleIdentity = async (parameters: AddModuleIdentityParameters): Promise<DataPlaneResponse<ModuleIdentity>> => {
    const connectionInformation = await dataPlaneConnectionHelper('todo');

    const dataPlaneRequest: DataPlaneRequest = {
        apiVersion:  HUB_DATA_PLANE_API_VERSION,
        body: JSON.stringify(parameters.moduleIdentity),
        hostName: connectionInformation.connectionInfo.hostName,
        httpMethod: HTTP_OPERATION_TYPES.Put,
        path: `devices/${parameters.moduleIdentity.deviceId}/modules/${parameters.moduleIdentity.moduleId}`,
        sharedAccessSignature: connectionInformation.sasToken,
    };

    const response = await request(DATAPLANE_CONTROLLER_ENDPOINT, dataPlaneRequest);
    const result = await dataPlaneResponseHelper(response);
    return result && result.body;
};

export const fetchModuleIdentity = async (parameters: FetchModuleIdentityParameters): Promise<DataPlaneResponse<ModuleIdentity[]>> => {
    const connectionInformation = await dataPlaneConnectionHelper('todo');

    const dataPlaneRequest: DataPlaneRequest = {
        apiVersion:  HUB_DATA_PLANE_API_VERSION,
        hostName: connectionInformation.connectionInfo.hostName,
        httpMethod: HTTP_OPERATION_TYPES.Get,
        path: `devices/${parameters.deviceId}/modules/${parameters.moduleId}`,
        sharedAccessSignature: connectionInformation.sasToken,
    };

    const response = await request(DATAPLANE_CONTROLLER_ENDPOINT, dataPlaneRequest);
    const result = await dataPlaneResponseHelper(response);
    return result && result.body;
};

export const deleteModuleIdentity = async (parameters: FetchModuleIdentityParameters): Promise<DataPlaneResponse<ModuleIdentity[]>> => {
    const connectionInformation = await dataPlaneConnectionHelper('todo');

    const dataPlaneRequest: DataPlaneRequest = {
        apiVersion:  HUB_DATA_PLANE_API_VERSION,
        headers: {} as any, // tslint:disable-line: no-any
        hostName: connectionInformation.connectionInfo.hostName,
        httpMethod: HTTP_OPERATION_TYPES.Delete,
        path: `devices/${parameters.deviceId}/modules/${parameters.moduleId}`,
        sharedAccessSignature: connectionInformation.sasToken,
    };

    (dataPlaneRequest.headers as any)[HEADERS.IF_MATCH] = '*'; // tslint:disable-line: no-any
    const response = await request(DATAPLANE_CONTROLLER_ENDPOINT, dataPlaneRequest);
    await dataPlaneResponseHelper(response);
    return;
};

export const invokeModuleDirectMethod = async (parameters: InvokeModuleMethodParameters): Promise<DirectMethodResult> => {
    if (!parameters.deviceId || !parameters.moduleId) {
        return;
    }

    const connectionInfo = await dataPlaneConnectionHelper('todo');
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
        path: `twins/${parameters.deviceId}/modules/${parameters.moduleId}/methods`,
        sharedAccessSignature: connectionInfo.sasToken,
    };

    const response = await request(DATAPLANE_CONTROLLER_ENDPOINT, dataPlaneRequest);
    const result = await dataPlaneResponseHelper(response);
    return result && result.body;
};

export const fetchModuleIdentityTwin = async (parameters: ModuleIdentityTwinParameters): Promise<DataPlaneResponse<ModuleTwin>> => {
    const connectionInformation = await dataPlaneConnectionHelper('todo');

    const dataPlaneRequest: DataPlaneRequest = {
        apiVersion:  HUB_DATA_PLANE_API_VERSION,
        hostName: connectionInformation.connectionInfo.hostName,
        httpMethod: HTTP_OPERATION_TYPES.Get,
        path: `twins/${parameters.deviceId}/modules/${parameters.moduleId}`,
        sharedAccessSignature: connectionInformation.sasToken,
    };

    const response = await request(DATAPLANE_CONTROLLER_ENDPOINT, dataPlaneRequest);
    const result = await dataPlaneResponseHelper(response);
    return result && result.body;
};

export const updateModuleIdentityTwin = async (parameters: ModuleTwin): Promise<DataPlaneResponse<ModuleTwin>> => {
    const connectionInformation = await dataPlaneConnectionHelper('todo');

    const dataPlaneRequest: DataPlaneRequest = {
        apiVersion:  HUB_DATA_PLANE_API_VERSION,
        body: JSON.stringify(parameters),
        hostName: connectionInformation.connectionInfo.hostName,
        httpMethod: HTTP_OPERATION_TYPES.Patch,
        path: `twins/${parameters.deviceId}/modules/${parameters.moduleId}`,
        sharedAccessSignature: connectionInformation.sasToken,
    };

    const response = await request(DATAPLANE_CONTROLLER_ENDPOINT, dataPlaneRequest);
    const result = await dataPlaneResponseHelper(response);
    return result && result.body;
};
