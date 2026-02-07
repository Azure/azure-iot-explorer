/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { DEFAULT_DIRECTORY } from './../../constants/apiConstants';
import { ModelDefinitionNotFound } from '../models/modelDefinitionNotFoundError';
import { getDeviceInterface } from '../shared/interfaceUtils';

export const fetchLocalFile = async (path: string, fileName: string): Promise<object> => {
    const deviceApi = getDeviceInterface();
    const result = await deviceApi.readLocalFile({ path, file: fileName });
    if (result === null) {
        throw new ModelDefinitionNotFound();
    }

    // Parse the result if it's a string
    if (typeof result === 'string') {
        return JSON.parse(result);
    }
    return result as object;
};

export const fetchLocalFileNaive = async (path: string, fileName: string): Promise<object> => {
    const deviceApi = getDeviceInterface();
    const result = await deviceApi.readLocalFileNaive({ path, file: fileName });
    if (!result) {
        throw new ModelDefinitionNotFound();
    }

    // Parse the result if it's a string
    if (typeof result === 'string') {
        return JSON.parse(result);
    }
    return result as object;
};

export const fetchDirectories = async (path: string): Promise<string[]> => {
    const deviceApi = getDeviceInterface();
    return deviceApi.getDirectories({ path: path || DEFAULT_DIRECTORY });
};
