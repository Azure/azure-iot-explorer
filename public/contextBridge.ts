/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { contextBridge } from 'electron';
import { generateSettingsInterface } from './factories/settingsInterface';

export const SETTINGS_INTERFACE_KEY: string = 'settings';
contextBridge.exposeInMainWorld(SETTINGS_INTERFACE_KEY, generateSettingsInterface());
