/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { getInitialAuthenticationState } from '../state';
import { authenticationReducer } from '../reducers';
import { useAsyncSagaReducer } from '../../shared/hooks/useAsyncSagaReducer';
import { AuthenticationStateContext } from './authenticationStateContext';
import { getLoginPreferenceAction, setLoginPreferenceAction } from '../actions';
import { authenticationSaga } from '../saga';

export interface AuthenticationInterface {
    getLoginPreference(): void;
    setLoginPreference(preference: string): void;
}

export const AuthenticationStateContextProvider: React.FC = props => {
    const [state, dispatch] = useAsyncSagaReducer(authenticationReducer, authenticationSaga, getInitialAuthenticationState(), 'authenticationState');

    const authenticationApi: AuthenticationInterface = {
        getLoginPreference: () => dispatch(getLoginPreferenceAction.started()),
        setLoginPreference: (reference: string) =>  dispatch(setLoginPreferenceAction.started(reference))
    };

    return (
        <AuthenticationStateContext.Provider value={[state, authenticationApi]}>
            {props.children}
        </AuthenticationStateContext.Provider>
    );
};
