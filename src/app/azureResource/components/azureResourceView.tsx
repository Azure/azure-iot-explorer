/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { Route, useParams } from 'react-router-dom';
import DeviceContentContainer from '../../devices/deviceContent/components/deviceContentContainer';
import DeviceListContainer from '../../devices/deviceList/components/deviceListContainer';
import { AddDevice } from '../../devices/addDevice/components/addDevice';
import { ROUTE_PARTS } from '../../constants/routes';
import { AccessVerificationState } from '../models/accessVerificationState';
import { useLocalizationContext } from '../../shared/contexts/localizationContext';
import { AzureResource } from '../models/azureResource';
import { ResourceKeys } from '../../../localization/resourceKeys';

export interface AzureResourceViewProps {
    activeAzureResource: AzureResource | undefined;
    setActiveAzureResourceByHostName(hostName: string): void;
}

export const AzureResourceView: React.FC<AzureResourceViewProps> = props => {
    const { activeAzureResource, setActiveAzureResourceByHostName } = props;
    const { hostName } = useParams();
    const { t } = useLocalizationContext();

    React.useEffect(() => {
        if (activeAzureResource && activeAzureResource.hostName === hostName) {
            return;
        }

        setActiveAzureResourceByHostName(hostName);
    },              [hostName]);

    if (!activeAzureResource) {
        return (<></>);
    }

    if (activeAzureResource.accessVerificationState === AccessVerificationState.Verifying) {
        return (<div>{t(ResourceKeys.azureResource.access.verifying)}</div>);
    }

    if (activeAzureResource.accessVerificationState === AccessVerificationState.Unauthorized) {
        return (<div>{t(ResourceKeys.azureResource.access.unauthorized)}</div>);
    }

    if (activeAzureResource.accessVerificationState === AccessVerificationState.Failed) {
        return (<div>{t(ResourceKeys.azureResource.access.failed)}</div>);
    }

    return (
        <>
            <Route path={`/${ROUTE_PARTS.RESOURCE}/${hostName}/${ROUTE_PARTS.DEVICES}`} component={DeviceListContainer} exact={true}/>
            <Route path={`/${ROUTE_PARTS.RESOURCE}/${hostName}/${ROUTE_PARTS.DEVICES}/${ROUTE_PARTS.ADD}`} component={AddDevice} exact={true} />
            <Route path={`/${ROUTE_PARTS.RESOURCE}/${hostName}/${ROUTE_PARTS.DEVICES}/${ROUTE_PARTS.DEVICE_DETAIL}/`} component={DeviceContentContainer}/>
        </>
    );
};
