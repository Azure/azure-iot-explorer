/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { contextBridge, ipcRenderer } from 'electron';
import { generateSettingsInterface } from './factories/settingsInterfaceFactory';
import { generateDirectoryInterface } from './factories/directoryInterfaceFactory';
import { generateModelRepositoryInterface } from './factories/modelRepositoryInterfaceFactory';

export const invokeInMainWorld = async <T>(channel: string, ...args: Array<unknown>): Promise<T> => {
    const { error, result } =  await ipcRenderer.invoke(channel);
    if (error) {
        throw error;
    }

    return result;
};

export const SETTINGS_INTERFACE_KEY: string = 'api_settings';
contextBridge.exposeInMainWorld(SETTINGS_INTERFACE_KEY, generateSettingsInterface());

export const DIRECTORY_INTERFACE_KEY: string = 'api_directory';
contextBridge.exposeInMainWorld(DIRECTORY_INTERFACE_KEY, generateDirectoryInterface());

export const MODEL_INTERFACE_KEY: string = 'api_modelDefinition';
contextBridge.exposeInMainWorld(MODEL_INTERFACE_KEY, generateModelRepositoryInterface());