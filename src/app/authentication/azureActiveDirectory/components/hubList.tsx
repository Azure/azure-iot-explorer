/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { DetailsList, IColumn, Link, SelectionMode } from '@fluentui/react';
import { useAzureActiveDirectoryStateContext } from '../context/azureActiveDirectoryStateContext';
import { IotHubDescription } from '../../../api/models/iotHubDescription';
import { ResourceKeys } from '../../../../localization/resourceKeys';
import { LARGE_COLUMN_WIDTH } from '../../../constants/columnWidth';
import { getConnectionInfoFromConnectionString } from '../../../api/shared/utils';
import { ROUTE_PARTS } from '../../../constants/routes';

export const HubList: React.FC = () => {
    const { t } = useTranslation();
    const history = useHistory();
    const [ { formState, iotHubs, iotHubKey }, { getIotHubKey }] =  useAzureActiveDirectoryStateContext();

    React.useEffect(() => {
        if (formState === 'keyPicked') { // only when connection string got picked successfully would navigate to device list view
            const hostName = getConnectionInfoFromConnectionString(iotHubKey).hostName;
            history.push(`/${ROUTE_PARTS.IOT_HUB}/${ROUTE_PARTS.HOST_NAME}/${hostName}/`);
        }
    },              [formState]);

    const getHubKey = (hubId: string, hubName: string) => () => {
        getIotHubKey(hubId, hubName);
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
                name: t(ResourceKeys.authentication.azureActiveDirectory.hubList.columns.name),
                onRender: (item: IotHubDescription) => (
                    <Link key={item.name} onClick={getHubKey(item.id, item.name)}>
                        {item.name}
                    </Link>)
            },
            {   ...columnProps,
                key: 'id',
                name: t(ResourceKeys.authentication.azureActiveDirectory.hubList.columns.location),
                onRender: item => item.location
            }];
    };

    return (
        <>
            <DetailsList
                items={iotHubs}
                columns={getColumns()}
                selectionMode={SelectionMode.none}
            />
            {formState === 'idle' && iotHubs?.length === 0 && t(ResourceKeys.authentication.azureActiveDirectory.hubList.noItemText)}
        </>
    );
};
