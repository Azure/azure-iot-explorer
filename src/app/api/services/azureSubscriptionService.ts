/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { AzureResourceManagementEndpoint } from '../models/azureResourceManagementEndpoint';
import { APPLICATION_JSON, HTTP_OPERATION_TYPES } from '../../constants/apiConstants';
import { AzureSubscription } from '../models/azureSubscription';
import { throwHttpErrorWhenResponseNotOk } from '../shared/fetchUtils';

const azureSubscriptionAPIVersion = '2019-06-01';
export type GetSubscriptionsParameters = AzureResourceManagementEndpoint;

export const getAzureSubscriptions = async (parameters: GetSubscriptionsParameters): Promise<AzureSubscription[]> => {
    const { authorizationToken, endpoint } = parameters;

    const resourceUrl = `https://${endpoint}/subscriptions?api-version=${azureSubscriptionAPIVersion}`;
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

    const responseBody = await response.json() as { value: AzureSubscription[] };
    return responseBody.value;
};
