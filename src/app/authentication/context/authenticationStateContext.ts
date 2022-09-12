/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { getInitialAuthenticationState, AuthenticationStateInterface } from '../state';
import { AuthenticationInterface } from './authenticationStateProvider';

export const getInitialAuthenticationOps = (): AuthenticationInterface => ({
    getLoginPreference: () => undefined,
    setLoginPreference: () => undefined
});

export const AuthenticationStateContext = React.createContext<[AuthenticationStateInterface, AuthenticationInterface]>
    ([
        getInitialAuthenticationState(),
        getInitialAuthenticationOps()
    ]);
export const useAuthenticationStateContext = () => React.useContext(AuthenticationStateContext);
