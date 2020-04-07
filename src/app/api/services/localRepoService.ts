/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { READ_FILE, CONTROLLER_API_ENDPOINT, DataPlaneStatusCode } from './../../constants/apiConstants';

export const fetchLocalFile = async (path: string, fileName: string): Promise<string> => {
    try {
        const response = await fetch(`${CONTROLLER_API_ENDPOINT}${READ_FILE}/${encodeURIComponent(path)}/${encodeURIComponent(fileName)}`);
        if (await response.status === DataPlaneStatusCode.NotFound) {
            throw new Error();
        }
        return await response.json();
    } catch (error) {
        throw error;
    }
};
