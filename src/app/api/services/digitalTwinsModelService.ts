/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { ModelDefinition } from '../models/modelDefinition';
import { FetchModelParameters } from '../parameters/repoParameters';
import {
    API_VERSION,
    CONTROLLER_API_ENDPOINT,
    DIGITAL_TWIN_API_VERSION,
    HEADERS,
    MODELREPO } from '../../constants/apiConstants';
import { HTTP_OPERATION_TYPES } from '../constants';
import { PnPModel } from '../models/metamodelMetadata';

export const fetchModel = async (parameters: FetchModelParameters): Promise<PnPModel> => {
    const expandQueryString = parameters.expand ? `&expand=true` : ``;
    const repositoryQueryString = parameters.repositoryId ? `&repositoryId=${parameters.repositoryId}` : '';
    const apiVersionQuerySTring = `?${API_VERSION}${DIGITAL_TWIN_API_VERSION}`;
    const queryString = `${apiVersionQuerySTring}${expandQueryString}${repositoryQueryString}`;
    const modelIdentifier = encodeURIComponent(parameters.id);
    const resourceUrl = `https://${parameters.repoServiceHostName}/models/${modelIdentifier}${queryString}`;

    const controllerRequest: RequestInitWithUri = {
        headers: {
            'Accept': 'application/json',
            'Authorization': parameters.token || '',
            'Content-Type': 'application/json'
        },
        method: HTTP_OPERATION_TYPES.Get,
        uri: resourceUrl
    };

    const response = await request(controllerRequest);
    if (!response.ok) {
        throw new Error(response.statusText);
    }

    // tslint:disable-next-line:cyclomatic-complexity
    const model =  await response.json() as ModelDefinition;
    const createdOn = response.headers.has(HEADERS.CREATED_ON) ? response.headers.get(HEADERS.CREATED_ON) : '';
    const etag = response.headers.has(HEADERS.ETAG) ? response.headers.get(HEADERS.ETAG) : '';
    const lastUpdated = response.headers.has(HEADERS.LAST_UPDATED) ? response.headers.get(HEADERS.LAST_UPDATED) : '';
    const modelId = response.headers.has(HEADERS.MODEL_ID) ? response.headers.get(HEADERS.MODEL_ID) : '';
    const publisherId = response.headers.has(HEADERS.PUBLISHER_ID) ? response.headers.get(HEADERS.PUBLISHER_ID) : '';
    const publisherName = response.headers.has(HEADERS.PUBLISHER_NAME) ? response.headers.get(HEADERS.PUBLISHER_NAME) : '';
    const pnpModel = {
        createdOn,
        etag,
        lastUpdated,
        model,
        modelId,
        publisherId,
        publisherName,
    };

    return pnpModel;
};

export const fetchModelDefinition = async (parameters: FetchModelParameters) => {
    try {
        const result = await fetchModel({
            ...parameters
        });
        return result.model;
    }
    catch (error) {
        throw new Error(error);
    }
};

export interface RequestInitWithUri extends RequestInit {
    uri: string;
    headers?: Record<string, string>;
}

export interface RepoConnectionSettings {
    hostName?: string;
    sharedAccessKey?: string;
    sharedAccessKeyName?: string;
    repositoryId?: string;
}

export const CONTROLLER_ENDPOINT = `${CONTROLLER_API_ENDPOINT}${MODELREPO}`;
const request = async (requestInit: RequestInitWithUri) => {
    return fetch(
        CONTROLLER_ENDPOINT,
        {
            body: JSON.stringify(requestInit),
            cache: 'no-cache',
            credentials: 'include',
            headers: new Headers({
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }),
            method: HTTP_OPERATION_TYPES.Post
        }
    );
};
