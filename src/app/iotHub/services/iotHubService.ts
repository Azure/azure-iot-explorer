/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { SharedAccessSignatureAuthorizationRule } from '../models/sharedAccessSignatureAuthorizationRule';
import { AzureResourceManagementEndpoint } from '../../azureResourceIdentifier/models/azureResourceManagementEndpoint';
import { AzureResourceIdentifier } from '../../azureResourceIdentifier/models/azureResourceIdentifier';
import { APPLICATION_JSON, HTTP_OPERATION_TYPES } from '../../constants/apiConstants';
import { HttpError } from '../../api/models/httpError';

const apiVersion = '2018-04-01';

export interface GetSharedAccessSignatureAuthorizationRulesParameters {
    azureResourceManagementEndpoint: AzureResourceManagementEndpoint;
    azureResourceIdentifier: AzureResourceIdentifier;
}
export const getSharedAccessSignatureAuthorizationRules = async (parameters: GetSharedAccessSignatureAuthorizationRulesParameters): Promise<SharedAccessSignatureAuthorizationRule[]> => {
    const { azureResourceManagementEndpoint, azureResourceIdentifier } = parameters;
    const { authorizationToken, endpoint } = azureResourceManagementEndpoint;

    const requestUrl = `https://${endpoint}${azureResourceIdentifier.id}/listKeys?api-version=${apiVersion}`;

    const serviceRequestParams: RequestInit = {
        headers: new Headers({
            'Accept': APPLICATION_JSON,
            'Authorization': `Bearer ${authorizationToken}`,
            'Content-Type': APPLICATION_JSON
        }),
        method: HTTP_OPERATION_TYPES.Post
    };
    const response = await fetch(requestUrl, serviceRequestParams);
    if (!response.ok) {
        throw new HttpError(response.status);
    }

    const responseBody = await response.json() as { value: SharedAccessSignatureAuthorizationRule[] };
    return responseBody.value;
};
