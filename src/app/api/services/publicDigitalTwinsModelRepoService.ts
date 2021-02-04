/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { ModelDefinition } from '../models/modelDefinition';
import { FetchModelParameters } from '../parameters/repoParameters';
import {
    API_VERSION,
    CONTROLLER_API_ENDPOINT,
    HEADERS,
    MODELREPO,
    MODEL_REPO_API_VERSION,
    PUBLIC_REPO_HOSTNAME,
    HTTP_OPERATION_TYPES } from '../../constants/apiConstants';
import { PnPModel } from '../models/metamodelMetadata';
import { getHeaderValue } from '../shared/fetchUtils';

export const convertModelIdentifier = (id: string) => {
    return `${id.toLowerCase().split(':').join('/').replace(';', '-')}.json`;
};

// tslint:disable-next-line:cyclomatic-complexity
export const fetchModel = async (parameters: FetchModelParameters): Promise<PnPModel> => {
    const modelIdentifier = encodeURIComponent(convertModelIdentifier(parameters.id));
    const hostName = parameters.url || PUBLIC_REPO_HOSTNAME;
    const resourceUrl = `https://${hostName}/${modelIdentifier}`;

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

    const modelInJson = await response.json();
    const partialResult =  {
        createdDate: getHeaderValue(response, HEADERS.MODEL_CREATED_DATE),
        etag: getHeaderValue(response, HEADERS.ETAG),
        modelId: getHeaderValue(response, HEADERS.MODEL_ID),
        publisherId: getHeaderValue(response, HEADERS.MODEL_PUBLISHER_ID),
        publisherName: getHeaderValue(response, HEADERS.MODEL_PUBLISHER_NAME)
    };

    if (Array.isArray(modelInJson)) { // if modelInJson is array, it is using expanded dtdl format
        for (const model of modelInJson) {
            if (model['@id']?.toString() === parameters.id) {
                return {
                    ...partialResult,
                    model
                };
            }
        }
    }
    return {
        ...partialResult,
        model: modelInJson
    };
};

export const fetchModelDefinition = async (parameters: FetchModelParameters): Promise<ModelDefinition> => {
    const result = await fetchModel({
        ...parameters
    });

    return result.model;
};

export const validateModelDefinitions = async (modelDefinitions: string) => {
    const apiVersionQueryString = `?${API_VERSION}${MODEL_REPO_API_VERSION}`;
    const controllerRequest: RequestInitWithUri = {
        body: modelDefinitions,
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'x-ms-client-request-id': 'azure iot explorer: validate model definition'
        },
        method: HTTP_OPERATION_TYPES.Post,
        uri: `https://${PUBLIC_REPO_HOSTNAME}/models/validate${apiVersionQueryString}`
    };

    return (await request(controllerRequest)).ok;
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
