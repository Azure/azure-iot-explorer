/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import {
    FetchDigitalTwinParameters,
    InvokeDigitalTwinInterfaceCommandParameters,
    PatchDigitalTwinParameters
} from '../parameters/deviceParameters';
import { DIGITAL_TWIN_API_VERSION_PREVIEW, HTTP_OPERATION_TYPES, DataPlaneStatusCode } from '../../constants/apiConstants';
import { CONNECTION_TIMEOUT_IN_SECONDS, RESPONSE_TIME_IN_SECONDS } from '../../constants/devices';
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

export const patchDigitalTwinAndGetResponseCode = async (parameters: PatchDigitalTwinParameters): Promise<number> => {
    if (!parameters.digitalTwinId) {
        return;
    }

    const connectionInformation = dataPlaneConnectionHelper(parameters);
    const dataPlaneRequest: DataPlaneRequest = {
        apiVersion: DIGITAL_TWIN_API_VERSION_PREVIEW,
        body: JSON.stringify(parameters.payload),
        hostName: connectionInformation.connectionInfo.hostName,
        httpMethod: HTTP_OPERATION_TYPES.Patch,
        path: `/digitalTwins/${parameters.digitalTwinId}`,
        sharedAccessSignature: connectionInformation.sasToken
    };

    const response = await request(DATAPLANE_CONTROLLER_ENDPOINT, dataPlaneRequest);
    return getPatchResultHelper(response);
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
        apiVersion: DIGITAL_TWIN_API_VERSION_PREVIEW,
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

// tslint:disable-next-line: cyclomatic-complexity
const getPatchResultHelper = async (response: Response) => {
    const dataPlaneResponse = await response;
    const result = await response.json();

    // success case
    if (DataPlaneStatusCode.Accepted === dataPlaneResponse.status || dataPlaneResponse.status === DataPlaneStatusCode.SuccessLowerBound) {
        return dataPlaneResponse.status;
    }

    // error case with message in body
    if (result && result.body) {
        if (result.body.Message || result.body.ExceptionMessage) {
            throw new Error(result.body.Message || result.body.ExceptionMessage);
        }
    }
    throw new Error(dataPlaneResponse.status && dataPlaneResponse.status.toString());
};
