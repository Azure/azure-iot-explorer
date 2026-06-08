/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { Input } from '@fluentui/react-components';
import { FilterRegular } from '@fluentui/react-icons';
import { useAzureActiveDirectoryStateContext } from '../context/azureActiveDirectoryStateContext';
import { AzureSubscription } from '../../../api/models/azureSubscription';
import { AzureTenant } from '../../../api/models/azureTenant';
import { ResourceKeys } from '../../../../localization/resourceKeys';
import { IotHubDescription } from '../../../api/models/iotHubDescription';
import './filterTextBox.scss';
import { LiveRegion } from '../../../shared/components/liveRegion';

export enum FilterType {
    Subscription,
    IoTHub,
    Tenant
}

export type FilterTextBoxPros = {
    filterType: FilterType.Subscription;
    setFilteredList: (listValue: AzureSubscription[]) => void;
} | {
    filterType: FilterType.IoTHub;
    setFilteredList: (listValue: IotHubDescription[]) => void;
} | {
    filterType: FilterType.Tenant;
    setFilteredList: (listValue: AzureTenant[]) => void;
}

export const FilterTextBox: React.FC<FilterTextBoxPros> = props => {
    const { t } = useTranslation();
    const [{ subscriptions, iotHubs, tenants }, ] =  useAzureActiveDirectoryStateContext();
    const [ filterValue, setFilterValue ] = React.useState('');
    const [ searchResultCount, setSearchResultCount] = React.useState(0);

    const onValueChange = (event: React.ChangeEvent<HTMLInputElement>, data: { value: string }) => {
        const newValue = data.value;
        setFilterValue(newValue);
        if (props.filterType === FilterType.IoTHub) {
            const filtered = iotHubs.filter(item => item.name.toLowerCase().includes(newValue.toLowerCase()));
            props.setFilteredList(filtered);
            setSearchResultCount(filtered.length);
        }
        else if (props.filterType === FilterType.Tenant) {
            const filtered = tenants.filter(item => (item.displayName || item.defaultDomain || '').toLowerCase().includes(newValue.toLowerCase()));
            props.setFilteredList(filtered);
            setSearchResultCount(filtered.length);
        }
        else {
            const filtered = subscriptions.filter(item => item.displayName.toLowerCase().includes(newValue.toLowerCase()));
            props.setFilteredList(filtered);
            setSearchResultCount(filtered.length);
        }
    };

    return (
        <div className="filter-box">
            <Input
                placeholder={t(ResourceKeys.authentication.azureActiveDirectory.filter.placeHolder)}
                aria-label={t(ResourceKeys.authentication.azureActiveDirectory.filter.placeHolder)}
                contentBefore={<FilterRegular />}
                role="searchbox"
                value={filterValue}
                onChange={onValueChange}
            />
            {filterValue && <LiveRegion message={`${searchResultCount.toString()} ${t(ResourceKeys.authentication.azureActiveDirectory.filter.result)}`}/>}
        </div>
    );
};
