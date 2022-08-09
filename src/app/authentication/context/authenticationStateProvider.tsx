import * as React from 'react';
import { getInitialAuthenticateState } from '../state';
import { authenticationReducer } from '../reducer';
import { useAsyncSagaReducer } from '../../shared/hooks/useAsyncSagaReducer';
import { AuthenticationStateContext } from './authenticationStateContext';
import { getLoginPreferenceAction, setLoginPreferenceAction } from '../actions';
import { authenticationSaga } from '../saga';

export interface AuthtenticationInterface {
    getLoginPreference(): void;
    setLoginPreference(preference: string): void;
}

export const AuthenticationStateContextProvider: React.FC = props => {
    const [state, dispatch] = useAsyncSagaReducer(authenticationReducer, authenticationSaga, getInitialAuthenticateState(), 'authenticationState');

    const authenticationApi: AuthtenticationInterface = {
        getLoginPreference: () => dispatch(getLoginPreferenceAction.started()),
        setLoginPreference: (reference: string) =>  dispatch(setLoginPreferenceAction.started(reference))
    };

    return (
        <AuthenticationStateContext.Provider value={[state, authenticationApi]}>
            {props.children}
        </AuthenticationStateContext.Provider>
    );
};
