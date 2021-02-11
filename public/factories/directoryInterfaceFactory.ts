/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { MESSAGE_CHANNELS } from '../constants';
import { DirectoryInterface, GetDirectoriesParameters } from '../interfaces/directoryInterface';
import { invokeInMainWorld } from '../contextBridge';

export const generateDirectoryInterface = (): DirectoryInterface => {
    return {
        getDirectories: async (params: GetDirectoriesParameters): Promise<string[]> => {
            return invokeInMainWorld<string[]>(MESSAGE_CHANNELS.DIRECTORY_GET_DIRECTORIES, params);
        },
    };
};
