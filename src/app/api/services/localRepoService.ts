/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { READ_FILE, GET_DIRECTORIES, CONTROLLER_API_ENDPOINT, DataPlaneStatusCode, DEFAULT_DIRECTORY } from './../../constants/apiConstants';
import { ModelDefinitionNotFound } from '../models/modelDefinitionNotFoundError';
import { ModelDefinitionNotValidJsonError } from '../models/modelDefinitionNotValidJsonError';

export const fetchLocalFile = async (path: string, fileName: string): Promise<string> => {
    const response = await fetch(`${CONTROLLER_API_ENDPOINT}${READ_FILE}/${encodeURIComponent(path)}/${encodeURIComponent(fileName)}`);
    if (await response.status === DataPlaneStatusCode.NoContentSuccess) {
        throw new ModelDefinitionNotFound();
    }

    if (await response.status === DataPlaneStatusCode.NotFound) {
        throw new ModelDefinitionNotValidJsonError(await response.text());
    }

    return response.json();
};

export const fetchDirectories = async (path: string): Promise<string[]> => {
    const response = await fetch(`${CONTROLLER_API_ENDPOINT}${GET_DIRECTORIES}/${encodeURIComponent(path || DEFAULT_DIRECTORY)}`);
    if (!path) {
        // only possible when platform is windows, expecting drives to be returned
        const responseText = await response.text();
        const drives = responseText.split(/\r\n/).map(drive => drive.trim()).filter(drive => drive !== '');
        drives.shift(); // remove header
        return drives.map(drive => `${drive}/`); // add trailing slash for drives
    }
    else {
        return response.json();
    }
};
