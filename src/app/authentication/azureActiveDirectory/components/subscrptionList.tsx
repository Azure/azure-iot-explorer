/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { DetailsList, IColumn, Link, SelectionMode } from '@fluentui/react';
import { FilterTextBox, FilterType } from './filterTextBox';
import { useAzureActiveDirectoryStateContext } from '../context/azureActiveDirectoryStateContext';
import { AzureSubscription } from '../../../api/models/azureSubscription';
import { ResourceKeys } from '../../../../localization/resourceKeys';
import { LARGE_COLUMN_WIDTH } from '../../../constants/columnWidth';

export interface SubscriptionListPros {
    renderHubList: () => void;
}

export const SubscriptionList: React.FC<SubscriptionListPros> = props => {
    const { t } = useTranslation();
    const [ { formState, subscriptions }, { getIotHubs } ] =  useAzureActiveDirectoryStateContext();
    const [ filteredSubscriptions, setFilteredSubscriptions ] = React.useState<AzureSubscription[]>([]);

    React.useEffect(() => {
        setFilteredSubscriptions(subscriptions);
    },              [subscriptions]);

    const renderHubList = (subscriptionId: string) => () => {
        getIotHubs(subscriptionId);
        props.renderHubList();
    };

    const getColumns = (): IColumn[] => {
        const columnProps = {
            isResizable: true,
            maxWidth: LARGE_COLUMN_WIDTH,
            minWidth: 150
        };

        return [
            {
                ...columnProps,
                key: 'name',
                name: t(ResourceKeys.authentication.azureActiveDirectory.subscriptionList.columns.name),
                onRender: (item: AzureSubscription) => (
                    <Link key={item.displayName} onClick={renderHubList(item.subscriptionId)}>
                        {item.displayName}
                    </Link>)
            },
            {   ...columnProps,
                key: 'id',
                name: t(ResourceKeys.authentication.azureActiveDirectory.subscriptionList.columns.id),
                onRender: item => item.subscriptionId
            },
            {
                ...columnProps,
                key: 'state',
                name: t(ResourceKeys.authentication.azureActiveDirectory.subscriptionList.columns.state),
                onRender: item => item.state
            }];
    };

    const setFilteredList = (listValue: AzureSubscription[]) => {
        setFilteredSubscriptions(listValue);
    };

    return (
        <>
            <FilterTextBox
                filterType={FilterType.Subscription}
                setFilteredList={setFilteredList}
            />
            <DetailsList
                items={filteredSubscriptions}
                columns={getColumns()}
                selectionMode={SelectionMode.none}
            />
            {formState === 'idle' && filteredSubscriptions?.length === 0 && t(ResourceKeys.authentication.azureActiveDirectory.subscriptionList.noItemText)}
        </>
    );
};
