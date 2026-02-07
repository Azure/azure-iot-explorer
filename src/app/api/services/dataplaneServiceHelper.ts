/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { DataPlaneStatusCode } from '../../constants/apiConstants';
import { getConnectionInfoFromConnectionString, generateSasToken } from '../shared/utils';
import { AUTHENTICATION_METHOD_PREFERENCE, CONNECTION_STRING_THROUGH_AAD } from '../../constants/browserStorage';
import { AuthenticationMethodPreference } from '../../authentication/state';
import { getConnectionStrings } from '../../shared/utils/credentialStorage';
import { DataPlaneRequest as IpcDataPlaneRequest, DataPlaneResponse } from '../../../../public/interfaces/deviceInterface';
import { getDeviceInterface } from '../shared/interfaceUtils';

export interface DataPlaneRequest {
    apiVersion: string;
    body?: string;
    headers?: unknown;
    hostName: string;
    httpMethod: string;
    path: string;
    sharedAccessSignature: string;
    queryString?: string;
}

/**
 * Make a data plane request via IPC to the main process
 */
export const request = async (_endpoint: string, parameters: DataPlaneRequest): Promise<DataPlaneResponse> => {
    const deviceApi = getDeviceInterface();

    const ipcRequest: IpcDataPlaneRequest = {
        apiVersion: parameters.apiVersion,
        body: parameters.body,
        headers: parameters.headers as Record<string, unknown>,
        hostName: parameters.hostName,
        httpMethod: parameters.httpMethod,
        path: parameters.path,
        sharedAccessSignature: parameters.sharedAccessSignature,
        queryString: parameters.queryString
    };

    return deviceApi.dataPlaneRequest(ipcRequest);
};

export const getConnectionStringHelper = async () => {
    const authSelection = await localStorage.getItem(AUTHENTICATION_METHOD_PREFERENCE);
    if (authSelection === AuthenticationMethodPreference.ConnectionString) {
        const connectionStrings = await getConnectionStrings();
        if (connectionStrings && connectionStrings.length > 0 && connectionStrings[0]) {
            const connString = connectionStrings[0].connectionString;
            return connString;
        }
        return undefined;
    }
    else {
        const aadConnString = await localStorage.getItem(CONNECTION_STRING_THROUGH_AAD);
        return aadConnString;
    }
};

export const dataPlaneConnectionHelper = async () => {
    const connectionString = await getConnectionStringHelper();
    const connectionInfo = getConnectionInfoFromConnectionString(connectionString);
    if (!(connectionInfo && connectionInfo.hostName)) {
        return;
    }

    const sasToken = generateSasToken({
        key: connectionInfo.sharedAccessKey,
        keyName: connectionInfo.sharedAccessKeyName,
        resourceUri: connectionInfo.hostName
    });

    return {
        connectionInfo,
        connectionString,
        sasToken,
    };
};

/**
 * Process the IPC response from data plane request
 */
// tslint:disable-next-line:cyclomatic-complexity
export const dataPlaneResponseHelper = async (response: DataPlaneResponse) => {
    // success with no content case
    if (DataPlaneStatusCode.NoContentSuccess === response.statusCode) {
        return;
    }

    // success case
    if (DataPlaneStatusCode.SuccessLowerBound <= response.statusCode && response.statusCode <= DataPlaneStatusCode.SuccessUpperBound) {
        return response.body;
    }

    // error case with message in body
    if (response.body && response.body.body) {
        if (response.body.body.Message || response.body.body.ExceptionMessage) {
            throw new Error(response.body.body.Message || response.body.body.ExceptionMessage);
        }
    }

    // error case with message as body
    if (response.body && response.body.Message) {
        throw new Error(response.body.Message);
    }

    throw new Error(response.statusCode && response.statusCode.toString());
};

// Keep for backward compatibility - endpoint is no longer used
export const DATAPLANE_CONTROLLER_ENDPOINT = '';
