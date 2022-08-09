/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
export interface AzureActiveDirectoryStateInterface {
    formState: 'initialized' | 'loggedIn' | 'loggedOut' | 'working' | 'failed' | 'idle';
    token: string;
}

export const getInitialAzureActiveDirectoryStateInitial = (): AzureActiveDirectoryStateInterface => ({
    formState: 'initialized',
    token: undefined
});
