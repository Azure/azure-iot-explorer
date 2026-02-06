/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { contextBridge } from 'electron';
import { generateSettingsInterface } from './factories/settingsInterfaceFactory';
import { generateAuthenticationInterface } from './factories/authenticationInterfaceFactory';
import { generateCredentialsInterface } from './factories/credentialsInterfaceFactory';
import { generateDeviceInterface } from './factories/deviceInterfaceFactory';
import { API_INTERFACES } from './constants';

contextBridge.exposeInMainWorld(API_INTERFACES.SETTINGS, generateSettingsInterface());
contextBridge.exposeInMainWorld(API_INTERFACES.AUTHENTICATION, generateAuthenticationInterface());
contextBridge.exposeInMainWorld(API_INTERFACES.CREDENTIALS, generateCredentialsInterface());
contextBridge.exposeInMainWorld(API_INTERFACES.DEVICE, generateDeviceInterface());
