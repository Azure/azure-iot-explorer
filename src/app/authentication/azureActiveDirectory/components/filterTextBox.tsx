/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { TextField } from '@fluentui/react';
import { useAzureActiveDirectoryStateContext } from '../context/azureActiveDirectoryStateContext';
import { AzureSubscription } from '../../../api/models/azureSubscription';
import { ResourceKeys } from '../../../../localization/resourceKeys';
import { IotHubDescription } from '../../../api/models/iotHubDescription';
import './filterTextBox.scss';

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

    const onValueChange = (event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) => {
        setFilterValue(newValue);
        if (props.filterType === FilterType.IoTHub) {
            props.setFilteredList(iotHubs.filter(item => item.name.toLowerCase().includes(newValue.toLowerCase())));
        }
        else {
            props.setFilteredList(subscriptions.filter(item => item.displayName.toLowerCase().includes(newValue.toLowerCase())));
        }
    };

    return (
        <div className="filter-box">
            <TextField
                placeholder={t(ResourceKeys.authentication.azureActiveDirectory.filter.placeHolder)}
                ariaLabel={t(ResourceKeys.authentication.azureActiveDirectory.filter.placeHolder)}
                iconProps={{ iconName: 'Filter' }}
                role="searchbox"
                value={filterValue}
                onChange={onValueChange}
            />
        </div>
    );
};
