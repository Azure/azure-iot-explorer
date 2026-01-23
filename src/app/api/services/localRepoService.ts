/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { CONTROLLER_API_ENDPOINT, DataPlaneStatusCode, DEFAULT_DIRECTORY, GET_DIRECTORIES, READ_FILE, READ_FILE_NAIVE } from './../../constants/apiConstants';
import { ModelDefinitionNotFound } from '../models/modelDefinitionNotFoundError';
import { ModelDefinitionNotValidJsonError } from '../models/modelDefinitionNotValidJsonError';
import { secureFetch } from '../shared/secureFetch';

export const fetchLocalFile = async (path: string, fileName: string): Promise<object> => {
    const response = await secureFetch(`${CONTROLLER_API_ENDPOINT}${READ_FILE}/${encodeURIComponent(path)}/${encodeURIComponent(fileName)}`);
    if (await response.status === DataPlaneStatusCode.NoContentSuccess || response.status === DataPlaneStatusCode.InternalServerError) {
        throw new ModelDefinitionNotFound();
    }
    if (await response.status === DataPlaneStatusCode.NotFound) {
        throw new ModelDefinitionNotValidJsonError(await response.text());
    }
    return response.json();
};

export const fetchLocalFileNaive = async (path: string, fileName: string): Promise<object> => {
    const response = await secureFetch(`${CONTROLLER_API_ENDPOINT}${READ_FILE_NAIVE}/${encodeURIComponent(path)}/${encodeURIComponent(fileName)}`);
    if (await response.status === DataPlaneStatusCode.NoContentSuccess ||
        response.status === DataPlaneStatusCode.InternalServerError ||
        response.status === DataPlaneStatusCode.NotFound)
    {
        throw new ModelDefinitionNotFound();
    }
    return response.json();
};

export const fetchDirectories = async (path: string): Promise<string[]> => {
    const response = await secureFetch(`${CONTROLLER_API_ENDPOINT}${GET_DIRECTORIES}/${encodeURIComponent(path || DEFAULT_DIRECTORY)}`);
    return response.json();
};
