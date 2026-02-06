/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { MESSAGE_CHANNELS } from '../constants';
import { SettingsInterface } from '../interfaces/settingsInterface';
import { invokeInMainWorld } from '../utils/invokeHelper';

export const generateSettingsInterface = (): SettingsInterface => {
    return {
        useHighContrast: async (): Promise<boolean> => {
            const result = invokeInMainWorld<boolean>(MESSAGE_CHANNELS.SETTING_HIGH_CONTRAST);
            return result;
        }
    };
};
