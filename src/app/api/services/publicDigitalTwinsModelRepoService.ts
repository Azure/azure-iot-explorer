/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { ModelDefinition } from '../models/modelDefinition';
import { FetchModelParameters } from '../parameters/repoParameters';
import {
    CONTROLLER_API_ENDPOINT,
    HEADERS,
    MODELREPO,
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

    const response = await fetch(
        resourceUrl,
        {
            cache: 'no-cache',
            credentials: 'include',
            headers: new Headers({
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            }),
            method: HTTP_OPERATION_TYPES.Get
        }
    );

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

export interface RequestInitWithUri extends RequestInit {
    uri: string;
    headers?: Record<string, string>;
}

export const CONTROLLER_ENDPOINT = `${CONTROLLER_API_ENDPOINT}${MODELREPO}`;
