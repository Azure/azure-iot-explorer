/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import {
    FetchDigitalTwinParameters,
    FetchDigitalTwinInterfacePropertiesParameters,
    PatchDigitalTwinInterfacePropertiesParameters,
    InvokeDigitalTwinInterfaceCommandParameters
} from '../parameters/deviceParameters';
import { DIGITAL_TWIN_API_VERSION, DIGITAL_TWIN_API_VERSION_PREVIEW, HTTP_OPERATION_TYPES } from '../../constants/apiConstants';
import { CONNECTION_TIMEOUT_IN_SECONDS, RESPONSE_TIME_IN_SECONDS } from '../../constants/devices';
import { DigitalTwinInterfaces } from '../models/digitalTwinModels';
import { dataPlaneConnectionHelper, dataPlaneResponseHelper, request, DATAPLANE_CONTROLLER_ENDPOINT, DataPlaneRequest } from './dataplaneServiceHelper';

export const fetchDigitalTwin = async (parameters: FetchDigitalTwinParameters) => {
    if (!parameters.digitalTwinId) {
        return;
    }

    const connectionInformation = dataPlaneConnectionHelper(parameters);
    const dataPlaneRequest: DataPlaneRequest = {
        apiVersion: DIGITAL_TWIN_API_VERSION_PREVIEW,
        hostName: connectionInformation.connectionInfo.hostName,
        httpMethod: HTTP_OPERATION_TYPES.Get,
        path: `/digitalTwins/${parameters.digitalTwinId}`,
        sharedAccessSignature: connectionInformation.sasToken
    };

    const response = await request(DATAPLANE_CONTROLLER_ENDPOINT, dataPlaneRequest);
    const result = await dataPlaneResponseHelper(response);
    return result.body;
};

export const fetchDigitalTwinInterfaceProperties = async (parameters: FetchDigitalTwinInterfacePropertiesParameters): Promise<DigitalTwinInterfaces> => {
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
};

export const patchDigitalTwinInterfaceProperties = async (parameters: PatchDigitalTwinInterfacePropertiesParameters): Promise<DigitalTwinInterfaces> => {
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
};

export const invokeDigitalTwinInterfaceCommand = async (parameters: InvokeDigitalTwinInterfaceCommandParameters) => {
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
};
