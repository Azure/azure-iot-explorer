/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { READ_FILE, CONTROLLER_API_ENDPOINT, DataPlaneStatusCode } from './../../constants/apiConstants';
import { ModelDefinitionNotFound } from '../models/modelDefinitionNotFoundError';
import { ModelDefinitionNotValidJsonError } from '../models/modelDefinitionNotValidJsonError';

export const fetchLocalFile = async (path: string, fileName: string): Promise<string> => {
    const response = await fetch(`${CONTROLLER_API_ENDPOINT}${READ_FILE}/${encodeURIComponent(path)}/${encodeURIComponent(fileName)}`);
    if (await response.status === DataPlaneStatusCode.NoContentSuccess) {
        throw new ModelDefinitionNotFound();
    }

    if (await response.status === DataPlaneStatusCode.NotFound) {
        throw new ModelDefinitionNotValidJsonError();
    }

    return response.json();
};
