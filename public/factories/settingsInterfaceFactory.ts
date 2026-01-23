/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { MESSAGE_CHANNELS } from '../constants';
import { SettingsInterface } from '../interfaces/settingsInterface';
import { invokeInMainWorld } from '../utils/invokeHelper';

export const generateSettingsInterface = (): SettingsInterface => {
    return {
        getCustomPort: async (): Promise<number | null> => {
            const result = invokeInMainWorld<number | null>(MESSAGE_CHANNELS.GET_CUSTOM_PORT);
            return result;
        },
        useHighContrast: async (): Promise<boolean> => {
            const result = invokeInMainWorld<boolean>(MESSAGE_CHANNELS.SETTING_HIGH_CONTRAST);
            return result;
        }
    };
};
