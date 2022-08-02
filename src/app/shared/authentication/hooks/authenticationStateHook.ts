import { Action } from 'typescript-fsa';
import { AuthenticationStateType, authenticationStateInitial } from '../state';
import { authenticationSaga } from '../saga';
import { getAuthenticatinTokenAction, loginAction, logoutAction } from '../actions';
import { useAsyncSagaReducer } from '../../../shared/hooks/useAsyncSagaReducer';
import { authenticationReducer } from '../reducer';

export interface AuthenticationInterface {
    getToken(): void;
    login(): void;
    logout(): void;
}

export const useAuthenticationState = (): [AuthenticationStateType, AuthenticationInterface] => {
    const [state, dispatch] = useAsyncSagaReducer<AuthenticationStateType, Action<unknown>>(authenticationReducer, authenticationSaga, authenticationStateInitial(), 'authenticationState');

    return [
        state,
        {
            getToken: () => dispatch(getAuthenticatinTokenAction.started()),
            login: () =>  dispatch(loginAction.started()),
            logout: () => dispatch(logoutAction.started())
        }
    ];
};
