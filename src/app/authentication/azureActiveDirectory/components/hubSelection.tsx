/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { MultiLineShimmer } from '../../../shared/components/multiLineShimmer';
import { useAzureActiveDirectoryStateContext } from '../context/azureActiveDirectoryStateContext';
import { AzureActiveDirectoryCommandBar } from './commandBar';
import { HubList } from './hubList';
import { SubscriptionList } from './subscrptionList';
import { TenantList } from './tenantList';
import { BackButton } from './backButton';
import { ResourceKeys } from '../../../../localization/resourceKeys';
import './hubSelection.scss';

type ViewState = 'tenants' | 'subscriptions' | 'hubs';

export const HubSelection: React.FC = () => {
    const [{ token, formState }, { getToken, getTenants }] =  useAzureActiveDirectoryStateContext();
    const [ viewState, setViewState ] = React.useState<ViewState>('tenants');

    const renderTenantList = () => {
        setViewState('tenants');
    };

    const renderSubscriptionList = () => {
        setViewState('subscriptions');
    };

    const renderHubList = () => {
        setViewState('hubs');
    };

    React.useEffect(() => {
        getToken();
    },              []);

    React.useEffect(() => {
        if (token) {
            getTenants();
        }
    },              [token]);

    return (
        <>
            <AzureActiveDirectoryCommandBar/>
            {formState === 'working' ? <MultiLineShimmer/> : <div className="hub-selection-list">
                {token && viewState === 'tenants' &&
                    <TenantList renderSubscriptionList={renderSubscriptionList}/>
                }
                {viewState === 'subscriptions' &&
                    <>
                        <BackButton backToSubscription={renderTenantList} labelKey={ResourceKeys.authentication.azureActiveDirectory.subscriptionList.backButton}/>
                        <SubscriptionList renderHubList={renderHubList}/>
                    </>
                }
                {viewState === 'hubs' &&
                    <>
                        <BackButton backToSubscription={renderSubscriptionList}/>
                        <HubList/>
                    </>
                }
            </div>}
        </>
    );
};
