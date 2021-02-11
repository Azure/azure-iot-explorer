/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { ipcRenderer } from 'electron';
import { MESSAGE_CHANNELS } from '../constants';
import { SettingsInterface } from '../interfaces/settingsInterface';

export const generateSettingsInterface = (): SettingsInterface => {
    return {
        useHighContrast: async (): Promise<boolean> => {
            const result = await ipcRenderer.invoke(MESSAGE_CHANNELS.SETTING_HIGH_CONTRAST);
            return result;
        }
    };
};
