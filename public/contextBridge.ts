/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { contextBridge } from 'electron';
import { generateSettingsInterface } from './factories/settingsInterfaceFactory';
import { generateAuthenticationInterface } from './factories/authenticationInterfaceFactory';
import { API_INTERFACES } from './constants';

contextBridge.exposeInMainWorld(API_INTERFACES.SETTINGS, generateSettingsInterface());
contextBridge.exposeInMainWorld(API_INTERFACES.AUTHENTICATION, generateAuthenticationInterface());
