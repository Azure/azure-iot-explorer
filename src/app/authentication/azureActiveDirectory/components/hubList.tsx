/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { IColumn, Label, Link, SelectionMode } from '@fluentui/react';
import { ResizableDetailsList } from '../../../shared/resizeDetailsList/resizableDetailsList';
import { useAzureActiveDirectoryStateContext } from '../context/azureActiveDirectoryStateContext';
import { IotHubDescription } from '../../../api/models/iotHubDescription';
import { ResourceKeys } from '../../../../localization/resourceKeys';
import { getConnectionInfoFromConnectionString } from '../../../api/shared/utils';
import { ROUTE_PARTS } from '../../../constants/routes';
import { FilterTextBox, FilterType } from './filterTextBox';

export const HubList: React.FC = () => {
    const { t } = useTranslation();
    const history = useHistory();
    const [{ formState, iotHubs, iotHubKey }, { getIotHubKey }] =  useAzureActiveDirectoryStateContext();
    const [ filteredHubs, setFilteredHubs ] = React.useState<IotHubDescription[]>([]);

    React.useEffect(() => {
        if (formState === 'keyPicked') { // only when connection string got picked successfully would navigate to device list view
            const hostName = getConnectionInfoFromConnectionString(iotHubKey).hostName;
            history.push(`/${ROUTE_PARTS.IOT_HUB}/${ROUTE_PARTS.HOST_NAME}/${hostName}/`);
        }
    },              [formState]);

    React.useEffect(() => {
        setFilteredHubs(iotHubs);
    },              [iotHubs]);

    const getHubKey = (hubId: string, hubName: string) => () => {
        getIotHubKey(hubId, hubName);
    };

    const getColumns = (): IColumn[] => {
        return [
            {
                key: 'name',
                minWidth: 150,
                name: t(ResourceKeys.authentication.azureActiveDirectory.hubList.columns.name)
            },
            {
                key: 'id',
                minWidth: 150,
                name: t(ResourceKeys.authentication.azureActiveDirectory.hubList.columns.location)
            }];
    };

    const renderItemColumn = (item: IotHubDescription, index: number, column: IColumn) => {
        switch (column.key) {
            case 'name':
                return (
                    <Link key={item.name} onClick={getHubKey(item.id, item.name)}>
                        {item.name}
                    </Link>
                );
            case 'id':
                return (
                    <Label
                        key={column.key}
                    >
                        {item.location}
                    </Label>
                );
            default:
                return;
        }
    };

    const setFilteredList = (listValue: IotHubDescription[]) => {
        setFilteredHubs(listValue);
    };

    return (
        <>
            <FilterTextBox
                filterType={FilterType.IoTHub}
                setFilteredList={setFilteredList}
            />
            <ResizableDetailsList
                items={filteredHubs}
                columns={getColumns()}
                selectionMode={SelectionMode.none}
                onRenderItemColumn={renderItemColumn}
            />
            {formState === 'idle' && filteredHubs?.length === 0 && t(ResourceKeys.authentication.azureActiveDirectory.hubList.noItemText)}
        </>
    );
};
