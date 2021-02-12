/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { READ_FILE, GET_DIRECTORIES, CONTROLLER_API_ENDPOINT, DataPlaneStatusCode, DEFAULT_DIRECTORY } from './../../constants/apiConstants';
import { ModelDefinitionNotFound } from '../models/modelDefinitionNotFoundError';
import { ModelDefinitionNotValidJsonError } from '../models/modelDefinitionNotValidJsonError';
import { ModelRepositoryInterface, MODEL_PARSE_ERROR, ModelParseErrorData } from '../../../../public/interfaces/modelRepositoryInterface';
import { API_INTERFACES } from '../../../../public/constants';
import { ContextBridgeError } from '../../../../public/utils/errorHelper';

export const getModelRepositoryInterface = (): ModelRepositoryInterface => {
    // tslint:disable-next-line: no-any no-string-literal
    const api = (window as any)[API_INTERFACES.MODEL_DEFINITION];
    return api as ModelRepositoryInterface;
};

export const fetchLocalFile = async (path: string, fileName: string): Promise<object> => {
    const api = getModelRepositoryInterface();

    try {
        const result = await api.getInterfaceDefinition({
            interfaceId: fileName,
            path
        });

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
