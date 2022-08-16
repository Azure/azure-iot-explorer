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
import { BackButton } from './backButton';
import './hubSelection.scss';

export const HubSelection: React.FC = () => {
    const [ { token, formState }, { getToken, getSubscriptions }] =  useAzureActiveDirectoryStateContext();
    const [ showHubList, setShowHubList ] = React.useState<boolean>(false);

    const renderSubscriptionList = () => {
        setShowHubList(false);
    };

    const renderHubList = () => {
        setShowHubList(true);
    };

    React.useEffect(() => {
        getToken();
    },              []);

    React.useEffect(() => {
        if (token) {
            getSubscriptions();
        }
    },              [token]);

    return (
        <>
            <AzureActiveDirectoryCommandBar/>
            {formState === 'working' ? <MultiLineShimmer/> : <div className="hub-selection-list">
                {token && !showHubList &&
                    <SubscriptionList renderHubList={renderHubList}/>
                }
                {showHubList &&
                    <>
                        <BackButton backToSubscription={renderSubscriptionList}/>
                        <HubList/>
                    </>
                }
            </div>}
        </>
    );
};
