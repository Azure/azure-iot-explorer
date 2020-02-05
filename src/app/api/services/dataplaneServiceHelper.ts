/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { DataPlaneParameters } from '../parameters/deviceParameters';
import { CONTROLLER_API_ENDPOINT, DATAPLANE, DataPlaneStatusCode } from '../../constants/apiConstants';
import { HTTP_OPERATION_TYPES } from '../constants';
import { getConnectionInfoFromConnectionString, generateSasToken } from '../shared/utils';
import { PortIsInUseError } from '../models/portIsInUseError';

export const DATAPLANE_CONTROLLER_ENDPOINT = `${CONTROLLER_API_ENDPOINT}${DATAPLANE}`;

export interface DataPlaneRequest {
    apiVersion?: string;
    body?: string;
    headers?: unknown;
    hostName: string;
    httpMethod: string;
    path: string;
    sharedAccessSignature: string;
    queryString?: string;
}

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
export const dataPlaneResponseHelper = async (response: Response) => {
    const dataPlaneResponse = await response;

    // success with no content case
    if (DataPlaneStatusCode.NoContentSuccess === dataPlaneResponse.status) {
        return;
    }

    let result;
    try {
        result = await response.json();
    }
    catch {
        if (DataPlaneStatusCode.NotFound === dataPlaneResponse.status) {
            // no response with 404 highly indicates that server is not running
            throw new PortIsInUseError();
        }
        else {
            throw new Error();
        }
    }

    // success case
    if (DataPlaneStatusCode.SuccessLowerBound <= dataPlaneResponse.status && dataPlaneResponse.status <= DataPlaneStatusCode.SuccessUpperBound) {
        return result;
    }

    // error case with message in body
    if (result && result.body) {
        if (result.body.Message || result.body.ExceptionMessage) {
            throw new Error(result.body.Message || result.body.ExceptionMessage);
        }
    }

    // error case with message as body
    if (result && result.message) {
        throw new Error(result.message);
    }

    throw new Error();
};
