/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { DEFAULT_DIRECTORY } from './../../constants/apiConstants';
import { ModelDefinitionNotFound } from '../models/modelDefinitionNotFoundError';

export const fetchLocalFile = async (path: string, fileName: string): Promise<object> => {
    if (!window.api_device) {
        throw new Error('Device API not available - not running in Electron');
    }

    const result = await window.api_device.readLocalFile({ path, file: fileName });
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
    if (!window.api_device) {
        throw new Error('Device API not available - not running in Electron');
    }

    const result = await window.api_device.readLocalFileNaive({ path, file: fileName });
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
    if (!window.api_device) {
        throw new Error('Device API not available - not running in Electron');
    }

    return window.api_device.getDirectories({ path: path || DEFAULT_DIRECTORY });
};
