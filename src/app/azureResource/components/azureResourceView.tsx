/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { Route } from 'react-router-dom';
import DeviceContentContainer from '../../devices/deviceContent/components/deviceContentContainer';
import DeviceListContainer from '../../devices/deviceList/components/deviceListContainer';
import AddDeviceContainer from '../../devices/deviceList/components/addDevice/components/addDeviceContainer';
import { ROUTE_PARTS } from '../../constants/routes';
import { AccessVerificationState } from '../models/accessVerificationState';
import { useLocalizationContext } from '../../shared/contexts/localizationContext';
import { AzureResource } from '../models/azureResource';
import { ResourceKeys } from '../../../localization/resourceKeys';

export interface AzureResourceViewProps {
    activeAzureResource: AzureResource | undefined;
    currentHostName: string;
    currentUrl: string;
    setActiveAzureResourceByHostName(hostName: string): void;
}

export const AzureResourceView: React.FC<AzureResourceViewProps> = props => {
    const { activeAzureResource, currentHostName, currentUrl, setActiveAzureResourceByHostName } = props;
    const { t } = useLocalizationContext();

    React.useEffect(() => {
        if (activeAzureResource && activeAzureResource.hostName === currentHostName) {
            return;
        }

        setActiveAzureResourceByHostName(currentHostName);
    }, [currentHostName]); // tslint:disable-line:align

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
            <Route path={`${currentUrl}/${ROUTE_PARTS.DEVICES}`} component={DeviceListContainer} exact={true}/>
            <Route path={`${currentUrl}/${ROUTE_PARTS.DEVICES}/${ROUTE_PARTS.ADD}`} component={AddDeviceContainer} exact={true} />
            <Route path={`${currentUrl}/${ROUTE_PARTS.DEVICES}/${ROUTE_PARTS.DEVICE_DETAIL}/`} component={DeviceContentContainer}/>
        </>
    );
};
