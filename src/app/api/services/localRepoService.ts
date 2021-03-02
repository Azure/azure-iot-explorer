/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { READ_FILE, CONTROLLER_API_ENDPOINT, DataPlaneStatusCode, DEFAULT_DIRECTORY, GET_DIRECTORIES } from './../../constants/apiConstants';
import { ModelDefinitionNotFound } from '../models/modelDefinitionNotFoundError';
import { ModelDefinitionNotValidJsonError } from '../models/modelDefinitionNotValidJsonError';
import { MODEL_PARSE_ERROR, ModelParseErrorData } from '../../../../public/interfaces/modelRepositoryInterface';
import { ContextBridgeError } from '../../../../public/utils/errorHelper';
import { getLocalModelRepositoryInterface, getDirectoryInterface } from '../shared/interfaceUtils';
import { RbacModeNotReadyError } from '../models/rbacModeNotReadyError';

// tslint:disable-next-line:cyclomatic-complexity
export const fetchLocalFile = async (path: string, fileName: string): Promise<object> => {
    let api;

    try {
        api = getLocalModelRepositoryInterface();
    } catch (error) {
        if (error instanceof RbacModeNotReadyError) {
            const response = await fetch(`${CONTROLLER_API_ENDPOINT}${READ_FILE}/${encodeURIComponent(path)}/${encodeURIComponent(fileName)}`);
            if (await response.status === DataPlaneStatusCode.NoContentSuccess || response.status === DataPlaneStatusCode.InternalServerError) {
                throw new ModelDefinitionNotFound();
            }
            if (await response.status === DataPlaneStatusCode.NotFound) {
                throw new ModelDefinitionNotValidJsonError(await response.text());
            }
            return response.json();
        }
    }

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

// tslint:disable-next-line:cyclomatic-complexity
export const fetchDirectories = async (path: string): Promise<string[]> => {
    let api;
    try {
        api = getDirectoryInterface();
    } catch (error) {
        if (error instanceof RbacModeNotReadyError) {
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
        }
    }

    const result = await api.getDirectories({path: path || DEFAULT_DIRECTORY});
    return result;
};
