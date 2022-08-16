/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { AzureResourceManagementEndpoint } from '../models/azureResourceManagementEndpoint';
import { APPLICATION_JSON, HTTP_OPERATION_TYPES } from '../../constants/apiConstants';
import { IotHubDescription } from '../models/iotHubDescription';
import { throwHttpErrorWhenResponseNotOk } from '../shared/fetchUtils';
import { SharedAccessSignatureAuthorizationRule } from '../models/sharedAccessSignatureAuthorizationRule';

const apiVersion = '2018-04-01';
export interface GetIotHubsBySubscriptionParameters extends AzureResourceManagementEndpoint {
    subscriptionId: string;
}
export const getIotHubsBySubscription = async (parameters: GetIotHubsBySubscriptionParameters): Promise<IotHubDescription[]> => {
    const { authorizationToken, endpoint, subscriptionId } = parameters;

    const resourceUrl = `https://${endpoint}/subscriptions/${subscriptionId}/providers/Microsoft.Devices/IotHubs?api-version=${apiVersion}`;
    const serviceRequestParams: RequestInit = {
        headers: new Headers({
            'Accept': APPLICATION_JSON,
            'Authorization': `Bearer ${authorizationToken}`,
            'Content-Type': APPLICATION_JSON
        }),
        method: HTTP_OPERATION_TYPES.Get
    };
    const response = await fetch(resourceUrl, serviceRequestParams);
    await throwHttpErrorWhenResponseNotOk(response);

    const responseBody = await response.json() as { value: IotHubDescription[] };
    return responseBody.value;
};

export interface GetIotHubKeysParameters extends AzureResourceManagementEndpoint {
    hubId: string;
}
export const getIotHubKeys = async (parameters: GetIotHubKeysParameters): Promise<SharedAccessSignatureAuthorizationRule[]> => {
    const { authorizationToken, endpoint, hubId } = parameters;

    const resourceUrl = `https://${endpoint}/${hubId}/listkeys?api-version=${apiVersion}`;
    const serviceRequestParams: RequestInit = {
        headers: new Headers({
            'Accept': APPLICATION_JSON,
            'Authorization': `Bearer ${authorizationToken}`,
            'Content-Type': APPLICATION_JSON
        }),
        method: HTTP_OPERATION_TYPES.Post
    };
    const response = await fetch(resourceUrl, serviceRequestParams);
    await throwHttpErrorWhenResponseNotOk(response);

    const responseBody = await response.json() as { value: SharedAccessSignatureAuthorizationRule[] };
    return responseBody.value;
};
