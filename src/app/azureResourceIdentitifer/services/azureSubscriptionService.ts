/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { AzureResourceManagementEndpoint } from '../models/azureResourceManagementEndpoint';
import { APPLICATION_JSON, HTTP_OPERATION_TYPES } from '../../api/constants';
import { HttpError } from '../../api/models/httpError';
import { AzureSubscription } from '../models/azureSubscription';

const azureSubscriptionAPIVersion = '2019-06-01';
export interface GetSubscriptionsParameters {
    azureResourceManagementEndpoint: AzureResourceManagementEndpoint;
}

export const getAzureSubscriptions = async (parameters: GetSubscriptionsParameters): Promise<AzureSubscription[]> => {
    const { azureResourceManagementEndpoint } = parameters;
    const { authorizationToken, endpoint } = azureResourceManagementEndpoint;

    const resourceUrl = `${endpoint}/subscriptions?api-version=${azureSubscriptionAPIVersion}`;
    const serviceRequestParams: RequestInit = {
        headers: new Headers({
            'Accept': APPLICATION_JSON,
            'Authorization': `Bearer ${authorizationToken}`,
            'Content-Type': APPLICATION_JSON
        }),
        method: HTTP_OPERATION_TYPES.Get
    };
    const response = await fetch(resourceUrl, serviceRequestParams);
    if (!response.ok) {
        throw new HttpError(response.status);
    }

    const responseBody = await response.json() as AzureSubscription[];
    return responseBody;
};
