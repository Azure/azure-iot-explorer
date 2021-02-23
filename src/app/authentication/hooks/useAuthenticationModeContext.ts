/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';

export enum AuthenticationMode {
    connectionString,
    roleBased
}

export const useAuthenticationMode = (): AuthenticationModeContextType => {
    const [ authenticationMode, setAuthenticationMode ] = React.useState<AuthenticationMode>(AuthenticationMode.connectionString);
    return {
        authenticationMode,
        setAuthenticationMode
    };
};

export interface AuthenticationModeContextType {
    authenticationMode: AuthenticationMode;
    setAuthenticationMode(authenticationMode: AuthenticationMode): void;
}

export const AuthenticationModeContext = React.createContext<AuthenticationModeContextType>({
    authenticationMode: AuthenticationMode.connectionString,
    setAuthenticationMode: () => {} // tslint:disable-line: no-empty
});
export const useAuthenticationModeContext = () => React.useContext<AuthenticationModeContextType>(AuthenticationModeContext);
