/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { AuthenticationResult } from '@azure/msal-node';
import { MESSAGE_CHANNELS } from '../constants';
import { AuthenticationInterface } from '../interfaces/authenticationInterface';
import { invokeInMainWorld } from '../utils/invokeHelper';

export const generateAuthenticationInterface = (): AuthenticationInterface => {
    return {
        login: async (): Promise<AuthenticationResult> => {
            return invokeInMainWorld<AuthenticationResult>(MESSAGE_CHANNELS.AUTHENTICATION_LOGIN);
        },
        logout: async (): Promise<void> => {
            return invokeInMainWorld<void>(MESSAGE_CHANNELS.AUTHENTICATION_LOGOUT);
        }
    };
};
