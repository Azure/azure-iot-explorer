/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import 'jest';
import * as DigitalTwinService from './digitalTwinService';
import * as DataplaneService from './dataplaneServiceHelper';
import { HTTP_OPERATION_TYPES, DIGITAL_TWIN_API_VERSION_PREVIEW } from '../../constants/apiConstants';
import { CONNECTION_TIMEOUT_IN_SECONDS, RESPONSE_TIME_IN_SECONDS } from '../../constants/devices';
import { getConnectionInfoFromConnectionString } from '../shared/utils';

const deviceId = 'deviceId';
const connectionString = 'HostName=test-string.azure-devices.net;SharedAccessKeyName=owner;SharedAccessKey=fakeKey=';
const componentName = 'componentName';
const headers = new Headers({
    'Accept': 'application/json',
    'Content-Type': 'application/json'
});
// tslint:disable-next-line:no-empty
const emptyPromise = new Promise(() => {});
const sasToken = 'testSasToken';
const connectionInfo = getConnectionInfoFromConnectionString(connectionString);
const mockDataPlaneConnectionHelper = () => {
    if (!(connectionInfo && connectionInfo.hostName)) {
        return;
    }
    return {
        connectionInfo,
        sasToken,
    };
};

describe('digitalTwinService', () => {

    context('invokeDigitalTwinInterfaceCommand', () => {

        beforeEach(() => {
            jest.spyOn(DataplaneService, 'dataPlaneConnectionHelper').mockResolvedValue({
                connectionInfo: getConnectionInfoFromConnectionString(parameters.connectionString), connectionString, sasToken});
        });

        const parameters = {
            commandName: 'commandName',
            componentName,
            connectionString,
            digitalTwinId: undefined,
            payload: undefined
        };
        it ('returns if digitalTwinId is not specified', () => {
            expect(DigitalTwinService.invokeDigitalTwinInterfaceCommand(parameters)).toEqual(emptyPromise);
        });

        it('calls fetch with specified parameters and invokes DigitalTwinInterfaceCommand when response is 200', async () => {
            // tslint:disable
            const responseBody = {
                description: 'Invoked'
            };
            const response = {
                json: () => {
                    return {
                        body: responseBody,
                        headers:{}
                        }
                    },
                status: 200
            } as any;
            // tslint:enable
            jest.spyOn(window, 'fetch').mockResolvedValue(response);

            const result = await DigitalTwinService.invokeDigitalTwinInterfaceCommand({
                ...parameters,
                digitalTwinId: deviceId
            });

            const connectionInformation = mockDataPlaneConnectionHelper();
            const queryString = `connectTimeoutInSeconds=${CONNECTION_TIMEOUT_IN_SECONDS}&responseTimeoutInSeconds=${RESPONSE_TIME_IN_SECONDS}`;
            const dataPlaneRequest: DataplaneService.DataPlaneRequest = {
                apiVersion: DIGITAL_TWIN_API_VERSION_PREVIEW,
                body: JSON.stringify(parameters.payload),
                hostName: connectionInformation.connectionInfo.hostName,
                httpMethod: HTTP_OPERATION_TYPES.Post,
                path: `/digitalTwins/${deviceId}/components/${parameters.componentName}/commands/${parameters.commandName}`,
                queryString,
                sharedAccessSignature: connectionInformation.sasToken
            };

            const serviceRequestParams = {
                body: JSON.stringify(dataPlaneRequest),
                cache: 'no-cache',
                credentials: 'include',
                headers,
                method: HTTP_OPERATION_TYPES.Post,
                mode: 'cors',
            };

            expect(fetch).toBeCalledWith(DataplaneService.DATAPLANE_CONTROLLER_ENDPOINT, serviceRequestParams);
            expect(result).toEqual(responseBody);
        });

        it('throws Error when promise rejects', async () => {
            window.fetch = jest.fn().mockRejectedValueOnce(new Error('Internal server error'));
            await expect(DigitalTwinService.invokeDigitalTwinInterfaceCommand({
                ...parameters,
                digitalTwinId: deviceId
            })).rejects.toThrow('Internal server error');
        });
    });
});
