/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { IColumn, Label, Link, SelectionMode } from '@fluentui/react';
import { FilterTextBox, FilterType } from './filterTextBox';
import { useAzureActiveDirectoryStateContext } from '../context/azureActiveDirectoryStateContext';
import { AzureSubscription } from '../../../api/models/azureSubscription';
import { ResourceKeys } from '../../../../localization/resourceKeys';
import { ResizableDetailsList } from '../../../shared/resizeDetailsList/resizableDetailsList';

export interface SubscriptionListPros {
    renderHubList: () => void;
}

export const SubscriptionList: React.FC<SubscriptionListPros> = props => {
    const { t } = useTranslation();
    const [{ formState, subscriptions }, { getIotHubs } ] =  useAzureActiveDirectoryStateContext();
    const [ filteredSubscriptions, setFilteredSubscriptions ] = React.useState<AzureSubscription[]>([]);

    React.useEffect(() => {
        setFilteredSubscriptions(subscriptions);
    },              [subscriptions]);

    const renderHubList = (subscriptionId: string) => () => {
        getIotHubs(subscriptionId);
        props.renderHubList();
    };

    const getColumns = (): IColumn[] => {
        return [
            {
                key: 'name',
                minWidth: 150,
                name: t(ResourceKeys.authentication.azureActiveDirectory.subscriptionList.columns.name)
            },
            {
                key: 'id',
                minWidth: 150,
                name: t(ResourceKeys.authentication.azureActiveDirectory.subscriptionList.columns.id)
            },
            {
                key: 'state',
                minWidth: 150,
                name: t(ResourceKeys.authentication.azureActiveDirectory.subscriptionList.columns.state)
            }];
    };

    const renderItemColumn = (item: AzureSubscription, index: number, column: IColumn) => {
        switch (column.key) {
            case 'name':
                return (
                    <Link key={item.displayName} onClick={renderHubList(item.subscriptionId)}>
                        {item.displayName}
                    </Link>
                );
            case 'id':
                return (
                    <Label
                        key={column.key}
                    >
                        {item.subscriptionId}
                    </Label>
                );
            case 'state':
                return (
                    <Label
                        key={column.key}
                    >
                        {item.state}
                    </Label>
                );
            default:
                return;
        }
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
            <ResizableDetailsList
                items={filteredSubscriptions}
                columns={getColumns()}
                selectionMode={SelectionMode.none}
                onRenderItemColumn={renderItemColumn}
            />
            {formState === 'idle' && filteredSubscriptions?.length === 0 && t(ResourceKeys.authentication.azureActiveDirectory.subscriptionList.noItemText)}
        </>
    );
};
