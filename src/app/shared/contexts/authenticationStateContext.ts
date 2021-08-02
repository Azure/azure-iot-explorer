/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { AuthenticationInterface } from '../authentication/hooks/authenticationStateHook';
import { authenticationStateInitial, AuthenticationStateInterface } from '../authentication/state';

const AuthenticationStateContext = React.createContext<[AuthenticationStateInterface, AuthenticationInterface]>
    ([authenticationStateInitial(), {getToken: () => undefined, login: () => undefined, logout: () => undefined}]);
export const AuthenticationtateContextProvider = AuthenticationStateContext.Provider;
export const useAuthenticationStateContext = () => React.useContext(AuthenticationStateContext);
