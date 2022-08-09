/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
export enum AuthenticationMethodPreference {
    AzureAD = 'AzureAD',
    ConnectionString = 'ConnectionString'
}

export interface AuthenticationStateInterface {
    formState: 'initialized' | 'working' | 'failed' | 'idle';
    preference: string;
}

export const getInitialAuthenticateState = (): AuthenticationStateInterface => ({
    formState: 'initialized',
    preference: undefined
});
