/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { useAuthenticationMode, AuthenticationModeContext } from '../hooks/useAuthenticationModeContext';

export const AuthenticationModeWrapper: React.FC = ({children}) => {
    const authenticationMode = useAuthenticationMode();

    return (
        <AuthenticationModeContext.Provider value={authenticationMode}>
            {children}
        </AuthenticationModeContext.Provider>
    );
};
