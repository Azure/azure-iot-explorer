/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { AzureResourceManagementEndpoint } from '../models/azureResourceManagementEndpoint';
import { APPLICATION_JSON, HTTP_OPERATION_TYPES } from '../../constants/apiConstants';
import { AzureTenant } from '../models/azureTenant';
import { throwHttpErrorWhenResponseNotOk } from '../shared/fetchUtils';

const azureTenantAPIVersion = '2020-01-01';
export type GetTenantsParameters = AzureResourceManagementEndpoint;

export const getAzureTenants = async (parameters: GetTenantsParameters): Promise<AzureTenant[]> => {
    const { authorizationToken, endpoint } = parameters;

    const resourceUrl = `https://${endpoint}/tenants?api-version=${azureTenantAPIVersion}`;
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

    const responseBody = await response.json() as { value: AzureTenant[] };
    return responseBody.value;
};
