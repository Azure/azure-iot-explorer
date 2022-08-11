/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
export interface AzureActiveDirectoryStateInterface {
    formState: 'initialized' | 'working' | 'failed' | 'idle';
    token: string;
}

export const getInitialAzureActiveDirectoryState = (): AzureActiveDirectoryStateInterface => ({
    formState: 'initialized',
    token: undefined
});
