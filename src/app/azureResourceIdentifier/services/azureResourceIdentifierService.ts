/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { ContinuingResultSet } from '../../api/models/continuingResultSet';
import { AzureResourceIdentifier } from '../models/azureResourceIdentifier';
import { AzureResourceIdentifierType } from '../models/azureResourceIdentifierType';
import { AzureResourceIdentifierQuery } from '../models/azureResourceIdentifierQuery';
import { AzureResourceIdentifierQueryResult } from '../models/azureResourceIdentifierQueryResult';
import { APPLICATION_JSON, HTTP_OPERATION_TYPES } from '../../api/constants';
import { AzureResourceManagementEndpoint } from '../models/azureResourceManagementEndpoint';
import { HttpError } from '../../api/models/httpError';

const azureResourceManagementAPIVersion = '2019-04-01';
const azureResourceManagementQueryFields = [
    'id',
    'name',
    'type',
    'location',
    'resourceGroup',
    'subscriptionId'
];

export interface GetAzureResourceIdentifiersParameters {
    azureResourceManagementEndpoint: AzureResourceManagementEndpoint;
    continuationToken?: string;
    subscriptionIds: string[];
    resourceType: AzureResourceIdentifierType;
}
export const getAzureResourceIdentifiers = async (parameters: GetAzureResourceIdentifiersParameters): Promise<ContinuingResultSet<AzureResourceIdentifier>> => {
    const { azureResourceManagementEndpoint, continuationToken, subscriptionIds, resourceType } = parameters;
    const { authorizationToken, endpoint } = azureResourceManagementEndpoint;

    const resourceUrl = `https://${endpoint}/providers/Microsoft.ResourcesGraph/resources?api-version=${azureResourceManagementAPIVersion}`;
    const requestBody: AzureResourceIdentifierQuery = {
        query: `where type =~ '${resourceType}' | project ${azureResourceManagementQueryFields.join(',')}`,
        subscriptions: subscriptionIds,
    };

    if (continuationToken) {
        requestBody.options = {
            $skipToken: continuationToken
        };
    }

    const serviceRequestParams: RequestInit = {
        body: JSON.stringify(requestBody),
        headers: new Headers({
            'Accept': APPLICATION_JSON,
            'Authorization': `Bearer ${authorizationToken}`,
            'Content-Type': APPLICATION_JSON
        }),
        method: HTTP_OPERATION_TYPES.Post
    };
    const response = await fetch(resourceUrl, serviceRequestParams);
    if (!response.ok) {
        throw new HttpError(response.status);
    }

    const responseBody = await response.json() as AzureResourceIdentifierQueryResult;
    const azureResourceIdentifiers = (responseBody.data && responseBody.data.rows) ?
        responseBody.data.rows.map(row => mapPropertyArrayToObject(azureResourceManagementQueryFields, row) as AzureResourceIdentifier) :
        [];

    const resultSet: ContinuingResultSet<AzureResourceIdentifier> = {
        continuationToken: responseBody.$skipToken,
        resultSet: azureResourceIdentifiers
    };

    return resultSet;
};

export interface GetAzureResourceIdentifierParameters {
    azureResourceManagementEndpoint: AzureResourceManagementEndpoint;
    resourceName: string;
    resourceType: AzureResourceIdentifierType;
    subscriptionIds: string[];
}
export const getAzureResourceIdentifier = async (parameters: GetAzureResourceIdentifierParameters): Promise<AzureResourceIdentifier | undefined> => {
    const { azureResourceManagementEndpoint, subscriptionIds, resourceName, resourceType } = parameters;
    const { authorizationToken, endpoint } = azureResourceManagementEndpoint;

    const resourceUrl = `https://${endpoint}/providers/Microsoft.ResourcesGraph/resources?api-version=${azureResourceManagementAPIVersion}`;
    const requestBody: AzureResourceIdentifierQuery = {
        query: `where type =~ '${resourceType}' and name =~ '${resourceName}' | project ${azureResourceManagementQueryFields.join(',')}`,
        subscriptions: subscriptionIds,
    };

    const serviceRequestParams: RequestInit = {
        body: JSON.stringify(requestBody),
        headers: new Headers({
            'Accept': APPLICATION_JSON,
            'Authorization': `Bearer ${authorizationToken}`,
            'Content-Type': APPLICATION_JSON
        }),
        method: HTTP_OPERATION_TYPES.Post
    };
    const response = await fetch(resourceUrl, serviceRequestParams);
    if (!response.ok) {
        throw new HttpError(response.status);
    }

    const responseBody = await response.json() as AzureResourceIdentifierQueryResult;
    const azureResourceIdentifier = (responseBody.data && responseBody.data.rows && responseBody.data.rows.length > 0) ?
        mapPropertyArrayToObject( azureResourceManagementQueryFields, responseBody.data.rows[0]) :
        undefined;

    return azureResourceIdentifier as AzureResourceIdentifier | undefined;
};

export const mapPropertyArrayToObject = (fieldNames: string[], fieldValues: string[]): object => {
    const result = {} as any; // tslint:disable-line:no-any
    fieldNames.forEach((fieldName, index) => {
        result[fieldName] = index < fieldValues.length ? fieldValues[index] : undefined;
    });

    return result;
};
