import * as React from 'react';
import { getInitialAzureActiveDirectoryStateInitial } from '../state';
import { azureActiveDirectoryReducer } from '../reducer';
import { useAsyncSagaReducer } from '../../../shared/hooks/useAsyncSagaReducer';
import { AzureActiveDirectoryStateContext } from './azureActiveDirectoryStateContext';
import { getUserProfileTokenAction, loginAction, logoutAction } from '../actions';
import { azureActiveDirectorySaga } from '../saga';

export interface AzureActiveDirectoryInterface {
    getToken(): void;
    login(): void;
    logout(): void;
}

export const AzureActiveDirectoryStateContextProvider: React.FC = props => {
    const [state, dispatch] = useAsyncSagaReducer(azureActiveDirectoryReducer, azureActiveDirectorySaga, getInitialAzureActiveDirectoryStateInitial(), 'azureActiveDirectoryState');

    const azureActiveDirectoryApi: AzureActiveDirectoryInterface = {
        getToken: () => dispatch(getUserProfileTokenAction.started()),
        login: () =>  dispatch(loginAction.started()),
        logout: () => dispatch(logoutAction.started())
    };

    return (
        <AzureActiveDirectoryStateContext.Provider value={[state, azureActiveDirectoryApi]}>
            {props.children}
        </AzureActiveDirectoryStateContext.Provider>
    );
};
