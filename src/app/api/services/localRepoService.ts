/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { DEFAULT_DIRECTORY } from './../../constants/apiConstants';
import { ModelDefinitionNotFound } from '../models/modelDefinitionNotFoundError';
import { ModelDefinitionNotValidJsonError } from '../models/modelDefinitionNotValidJsonError';
import { MODEL_PARSE_ERROR, ModelParseErrorData } from '../../../../public/interfaces/modelRepositoryInterface';
import { ContextBridgeError } from '../../../../public/utils/errorHelper';
import { getLocalModelRepositoryInterface, getDirectoryInterface } from '../shared/interfaceUtils';

export const fetchLocalFile = async (path: string, fileName: string): Promise<object> => {
    const api = getLocalModelRepositoryInterface();

    try {
        const result = await api.getInterfaceDefinition({
            interfaceId: fileName,
            path
        });

        if (!result) {
            throw new ModelDefinitionNotFound();
        }
        return result;
    } catch (error) {
        if (error.message === MODEL_PARSE_ERROR) {
            const fileNames = (error as ContextBridgeError<ModelParseErrorData>).data.fileNames;
            throw new ModelDefinitionNotValidJsonError(JSON.stringify(fileNames));
        }

        throw new ModelDefinitionNotFound();
    }
};

export const fetchDirectories = async (path: string): Promise<string[]> => {
    const api = getDirectoryInterface();
    const result = await api.getDirectories({path: path || DEFAULT_DIRECTORY});
    return result;
};
