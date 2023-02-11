/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { READ_FILE, CONTROLLER_API_ENDPOINT, DataPlaneStatusCode, GET_DIRECTORIES, DEFAULT_DIRECTORY, READ_FILE_NAIVE } from '../../constants/apiConstants';
import { ModelDefinitionNotFound } from '../models/modelDefinitionNotFoundError';
import { ModelDefinitionNotValidJsonError } from '../models/modelDefinitionNotValidJsonError';

export interface GetInterfaceDefinitionParameters {
    interfaceId: string;
    path: string;
}

export interface GetDirectoriesParameters {
    path: string;
}

export const getDirectories = async (params: GetDirectoriesParameters): Promise<string[]> => {
    const response = await fetch(`${CONTROLLER_API_ENDPOINT}${GET_DIRECTORIES}/${encodeURIComponent(params.path)}`);
    if (params.path === DEFAULT_DIRECTORY) {
        // only possible when platform is windows, expecting drives to be returned
        const responseText = await response.text();
        const drives = responseText.split(/\r\n/).map(drive => drive.trim()).filter(drive => drive !== '');
        drives.shift(); // remove header
        return drives.map(drive => `${drive}/`); // add trailing slash for drives
    }
    else {
        return response.json();
    }
}

export const getInterfaceDefinition = async (params: GetInterfaceDefinitionParameters): Promise<object | undefined> => {
    const response = await fetch(`${CONTROLLER_API_ENDPOINT}${READ_FILE}/${encodeURIComponent(params.path)}/${encodeURIComponent(params.interfaceId)}`);
    if (await response.status === DataPlaneStatusCode.NoContentSuccess || response.status === DataPlaneStatusCode.InternalServerError) {
        throw new ModelDefinitionNotFound();
    }
    if (await response.status === DataPlaneStatusCode.NotFound) {
        throw new ModelDefinitionNotValidJsonError(await response.text());
    }
    return response.json();
}

export const getInterfaceDefinitionNaive = async (params: GetInterfaceDefinitionParameters): Promise<object | undefined> => {
    const response = await fetch(`${CONTROLLER_API_ENDPOINT}${READ_FILE_NAIVE}/${encodeURIComponent(params.path)}/${encodeURIComponent(params.interfaceId)}`);
    if (await response.status === DataPlaneStatusCode.NoContentSuccess || response.status === DataPlaneStatusCode.InternalServerError) {
        throw new ModelDefinitionNotFound();
    }
    if (await response.status === DataPlaneStatusCode.NotFound) {
        throw new ModelDefinitionNotValidJsonError(await response.text());
    }
    return response.json();
}
