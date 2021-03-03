/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { ModelDefinition } from '../models/modelDefinition';
import { FetchModelParameters } from '../parameters/repoParameters';
import {
    HEADERS,
    HTTP_OPERATION_TYPES } from '../../constants/apiConstants';
import { PnPModel } from '../models/metamodelMetadata';
import { getHeaderValue } from '../shared/fetchUtils';
import { getPublicDigitalTwinsModelInterface } from '../shared/interfaceUtils';

export const fetchModelDefinition = async (parameters: FetchModelParameters): Promise<ModelDefinition> => {
    const result = await fetchModel({
        ...parameters
    });

    return result.model;
};

export const fetchModel = async (parameters: FetchModelParameters): Promise<PnPModel> => {
    const api = getPublicDigitalTwinsModelInterface();
    const response = await api.getModelDefinition(parameters);

    if (!response.ok) {
        throw new Error(response.statusText);
    }

    const modelInJson = await response.json();
    return convertModelFetched(response, modelInJson, parameters.id);
};

export const convertModelFetched = (response: Response, modelInJson: any, id: string) => { // tslint:disable-line:no-any
    const partialResult =  {
        createdDate: getHeaderValue(response, HEADERS.MODEL_CREATED_DATE),
        etag: getHeaderValue(response, HEADERS.ETAG),
        modelId: getHeaderValue(response, HEADERS.MODEL_ID),
        publisherId: getHeaderValue(response, HEADERS.MODEL_PUBLISHER_ID),
        publisherName: getHeaderValue(response, HEADERS.MODEL_PUBLISHER_NAME)
    };

    if (Array.isArray(modelInJson)) { // if modelInJson is array, it is using expanded dtdl format
        for (const model of modelInJson) {
            if (model['@id']?.toString() === id) {
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

export const convertModelIdentifier = (id: string) => {
    return `${id.toLowerCase().split(':').join('/').replace(';', '-')}.json`;
};
