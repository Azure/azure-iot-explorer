/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { getInitialAuthenticateState, AuthenticationStateInterface } from '../state';
import { AuthtenticationInterface } from './authenticationStateProvider';

export const AuthenticationStateContext = React.createContext<[AuthenticationStateInterface, AuthtenticationInterface]>
    ([
        getInitialAuthenticateState(),
        {
            getLoginPreference: () => undefined,
            setLoginPreference: () => undefined
        }
    ]);
export const useAuthenticationStateContext = () => React.useContext(AuthenticationStateContext);
