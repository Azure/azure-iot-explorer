/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { getInitialAzureActiveDirectoryStateInitial, AzureActiveDirectoryStateInterface } from '../state';
import { AzureActiveDirectoryInterface } from './azureActiveDirectoryStateProvider';

export const AzureActiveDirectoryStateContext = React.createContext<[AzureActiveDirectoryStateInterface, AzureActiveDirectoryInterface]>
    ([
        getInitialAzureActiveDirectoryStateInitial(),
        {
            getToken: () => undefined,
            login: () => undefined,
            logout: () => undefined
        }
    ]);
export const useAzureActiveDirectoryStateContext = () => React.useContext(AzureActiveDirectoryStateContext);
