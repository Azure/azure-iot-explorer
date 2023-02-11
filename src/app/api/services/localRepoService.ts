/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { DEFAULT_DIRECTORY } from './../../constants/apiConstants';
import { ModelDefinitionNotFound } from '../models/modelDefinitionNotFoundError';
import { getDirectories, getInterfaceDefinition, getInterfaceDefinitionNaive } from '../handlers/localRepoServiceHandler';

export const fetchLocalFile = async (path: string, fileName: string): Promise<object> => {
    try {
        return await getInterfaceDefinition({
            interfaceId: fileName,
            path
        });
    } catch (error) {
        throw new ModelDefinitionNotFound();
    }
};

export const fetchLocalFileNaive = async (path: string, fileName: string): Promise<object> => {
    try {
        return await getInterfaceDefinitionNaive({
            interfaceId: fileName,
            path
        });
    } catch (error) {
        throw new ModelDefinitionNotFound();
    }
};

export const fetchDirectories = async (path: string): Promise<string[]> => {
    const result = await getDirectories({path: path || DEFAULT_DIRECTORY});
    return result;
};
