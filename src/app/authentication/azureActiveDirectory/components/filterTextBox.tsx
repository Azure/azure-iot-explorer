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
import { ResourceKeys } from '../../../../localization/resourceKeys';
import { IotHubDescription } from '../../../api/models/iotHubDescription';
import './filterTextBox.scss';
import { LiveRegion } from '../../../shared/components/liveRegion';

export enum FilterType {
    Subscription,
    IoTHub
}

export interface FilterTextBoxPros {
    filterType: FilterType;
    setFilteredList: (listValue: AzureSubscription[] | IotHubDescription[]) => void;
}

export const FilterTextBox: React.FC<FilterTextBoxPros> = props => {
    const { t } = useTranslation();
    const [{ subscriptions, iotHubs }, ] =  useAzureActiveDirectoryStateContext();
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
