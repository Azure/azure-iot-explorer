/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import {
    FetchModuleIdentitiesParameters,
    AddModuleIdentityParameters,
    ModuleIdentityTwinParameters,
    FetchModuleIdentityParameters
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
    try {
        const connectionInformation = await dataPlaneConnectionHelper(parameters);

        const dataPlaneRequest: DataPlaneRequest = {
            apiVersion:  HUB_DATA_PLANE_API_VERSION,
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
        const connectionInformation = await dataPlaneConnectionHelper(parameters);

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
        return result.body;
    } catch (error) {
        throw error;
    }
};

export const fetchModuleIdentityTwin = async (parameters: ModuleIdentityTwinParameters): Promise<DataPlaneResponse<ModuleTwin>> => {
    try {
        const connectionInformation = await dataPlaneConnectionHelper(parameters);

        const dataPlaneRequest: DataPlaneRequest = {
            apiVersion:  HUB_DATA_PLANE_API_VERSION,
            hostName: connectionInformation.connectionInfo.hostName,
            httpMethod: HTTP_OPERATION_TYPES.Get,
            path: `twins/${parameters.deviceId}/modules/${parameters.moduleId}`,
            sharedAccessSignature: connectionInformation.sasToken,
        };

        const response = await request(DATAPLANE_CONTROLLER_ENDPOINT, dataPlaneRequest);
        const result = await dataPlaneResponseHelper(response);
        return result.body;
    } catch (error) {
        throw error;
    }
};

export const fetchModuleIdentity = async (parameters: FetchModuleIdentityParameters): Promise<DataPlaneResponse<ModuleIdentity[]>> => {
    try {
        const connectionInformation = await dataPlaneConnectionHelper(parameters);

        const dataPlaneRequest: DataPlaneRequest = {
            apiVersion:  HUB_DATA_PLANE_API_VERSION,
            hostName: connectionInformation.connectionInfo.hostName,
            httpMethod: HTTP_OPERATION_TYPES.Get,
            path: `devices/${parameters.deviceId}/modules/${parameters.moduleId}`,
            sharedAccessSignature: connectionInformation.sasToken,
        };

        const response = await request(DATAPLANE_CONTROLLER_ENDPOINT, dataPlaneRequest);
        const result = await dataPlaneResponseHelper(response);
        return result.body;
    } catch (error) {
        throw error;
    }
};

export const deleteModuleIdentity = async (parameters: FetchModuleIdentityParameters): Promise<DataPlaneResponse<ModuleIdentity[]>> => {
    try {
        const connectionInformation = await dataPlaneConnectionHelper(parameters);

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
    } catch (error) {
        throw error;
    }
};
