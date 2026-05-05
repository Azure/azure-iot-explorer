/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { Label, Link } from '@fluentui/react-components';
import { FilterTextBox, FilterType } from './filterTextBox';
import { useAzureActiveDirectoryStateContext } from '../context/azureActiveDirectoryStateContext';
import { AzureTenant } from '../../../api/models/azureTenant';
import { ResourceKeys } from '../../../../localization/resourceKeys';
import { IColumn, SelectionMode, ResizableDetailsList } from '../../../shared/resizeDetailsList/resizableDetailsList';

export interface TenantListProps {
    renderSubscriptionList: () => void;
}

export const TenantList: React.FC<TenantListProps> = props => {
    const { t } = useTranslation();
    const [{ formState, tenants }, { selectTenant, getSubscriptions }] = useAzureActiveDirectoryStateContext();
    const [filteredTenants, setFilteredTenants] = React.useState<AzureTenant[]>([]);

    React.useEffect(() => {
        setFilteredTenants(tenants);
    },              [tenants]);

    const onTenantSelected = (tenantId: string) => () => {
        selectTenant(tenantId);
        getSubscriptions(tenantId);
        props.renderSubscriptionList();
    };

    const getColumns = (): IColumn[] => {
        return [
            {
                key: 'name',
                minWidth: 200,
                name: t(ResourceKeys.authentication.azureActiveDirectory.tenantList.label)
            },
            {
                key: 'id',
                minWidth: 250,
                name: 'Tenant ID'
            }
        ];
    };

    const renderItemColumn = (item: AzureTenant, index: number, column: IColumn) => {
        switch (column.key) {
            case 'name':
                return (
                    <Link key={item.tenantId} onClick={onTenantSelected(item.tenantId)}>
                        {item.displayName || item.defaultDomain}
                    </Link>
                );
            case 'id':
                return (
                    <Label key={column.key}>
                        {item.tenantId}
                    </Label>
                );
            default:
                return <></>;
        }
    };

    const setFilteredList = (listValue: AzureTenant[]) => {
        setFilteredTenants(listValue);
    };

    return (
        <>
            <FilterTextBox
                filterType={FilterType.Tenant}
                setFilteredList={setFilteredList}
            />
            <ResizableDetailsList
                items={filteredTenants}
                columns={getColumns()}
                selectionMode={SelectionMode.none}
                onRenderItemColumn={renderItemColumn}
            />
            {formState === 'idle' && filteredTenants?.length === 0 && t(ResourceKeys.authentication.azureActiveDirectory.tenantList.noItemText)}
        </>
    );
};
