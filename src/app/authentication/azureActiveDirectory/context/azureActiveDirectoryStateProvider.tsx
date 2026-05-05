import * as React from 'react';
import { getInitialAzureActiveDirectoryState } from '../state';
import { azureActiveDirectoryReducer } from '../reducers';
import { useAsyncSagaReducer } from '../../../shared/hooks/useAsyncSagaReducer';
import { AzureActiveDirectoryStateContext } from './azureActiveDirectoryStateContext';
import { getUserProfileTokenAction, getSubscriptionListAction, loginAction, logoutAction, getIotHubsBySubscriptionAction, getIoTHubKeyAction, getTenantListAction, selectTenantAction } from '../actions';
import { azureActiveDirectorySaga } from '../saga';

export interface AzureActiveDirectoryInterface {
    getIotHubKey(hubId: string, hubName: string): void;
    getIotHubs(subscriptionId: string): void;
    getSubscriptions(tenantId: string): void;
    getTenants(): void;
    selectTenant(tenantId: string): void;
    getToken(): void;
    login(): void;
    logout(): void;
}

export const AzureActiveDirectoryStateContextProvider: React.FC<React.PropsWithChildren> = props => {
    const [state, dispatch] = useAsyncSagaReducer(azureActiveDirectoryReducer, azureActiveDirectorySaga, getInitialAzureActiveDirectoryState(), 'azureActiveDirectoryState');

    const azureActiveDirectoryApi: AzureActiveDirectoryInterface = {
        getIotHubKey: (hubId: string, hubName: string) => dispatch(getIoTHubKeyAction.started({hubId, hubName})),
        getIotHubs: (subscriptionId: string) => dispatch(getIotHubsBySubscriptionAction.started(subscriptionId)),
        getSubscriptions: (tenantId: string) => dispatch(getSubscriptionListAction.started(tenantId)),
        getTenants: () => dispatch(getTenantListAction.started()),
        selectTenant: (tenantId: string) => dispatch(selectTenantAction(tenantId)),
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
