/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { getInitialAzureActiveDirectoryState, AzureActiveDirectoryStateInterface } from '../state';
import { AzureActiveDirectoryInterface } from './azureActiveDirectoryStateProvider';

export const getInitialAzureActiveDirectoryOps = (): AzureActiveDirectoryInterface => ({
    getToken: () => undefined,
    login: () => undefined,
    logout: () => undefined
});

export const AzureActiveDirectoryStateContext = React.createContext<[AzureActiveDirectoryStateInterface, AzureActiveDirectoryInterface]>
    ([
        getInitialAzureActiveDirectoryState(),
        getInitialAzureActiveDirectoryOps()
    ]);
export const useAzureActiveDirectoryStateContext = () => React.useContext(AzureActiveDirectoryStateContext);
