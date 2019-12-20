/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Route, RouteComponentProps, Redirect } from 'react-router-dom';
import { StateInterface } from '../../shared/redux/state';
import DeviceContentContainer from '../../devices/deviceContent/components/deviceContentContainer';
import DeviceListContainer from '../../devices/deviceList/components/deviceListContainer';
import AddDeviceContainer from '../../devices/deviceList/components/addDevice/components/addDeviceContainer';
import SettingsPaneContainer from '../../settings/components/settingsPaneContainer';
import HeaderContainer from '../../shared/components/headerContainer';
import { ROUTE_PARTS } from '../../constants/routes';
import { setActiveAzureResourceByHostNameAction } from '../actions';
import { AccessVerificationState } from '../models/accessVerificationState';
import { useLocalizationContext } from '../../shared/contexts/localizationContext';
import { ResourceKeys } from '../../../localization/resourceKeys';

export type AzureResourceViewProps = RouteComponentProps;

export const AzureResourceView: React.FC<AzureResourceViewProps> = props => {
    const url = props.match.url;
    const hostName = (props.match.params as { hostName: string}).hostName;
    const { t } = useLocalizationContext();
    const currentAzureResource = useSelector((state: StateInterface) => state.azureResourceState.activeAzureResource);
    const dispatch = useDispatch();

    React.useEffect(() => {
        if (currentAzureResource && currentAzureResource.hostName === hostName) {
            return;
        }

        dispatch(setActiveAzureResourceByHostNameAction({ hostName }));
    }, [url]); // tslint:disable-line:align

    const renderContents = (): JSX.Element => {
        if (!currentAzureResource) {
            return (<></>);
        }

        if (currentAzureResource.accessVerificationState === AccessVerificationState.Verifying) {
            return (<div className="view">{t(ResourceKeys.azureResource.access.verifying)}</div>);
        }

        if (currentAzureResource.accessVerificationState === AccessVerificationState.Unauthorized) {
            return (<div className="view">{t(ResourceKeys.azureResource.access.unauthorized)}</div>);
        }

        if (currentAzureResource.accessVerificationState === AccessVerificationState.Failed) {
            return (<div className="view">{t(ResourceKeys.azureResource.access.failed)}</div>);
        }

        return (
            <>
                <Route path={`${url}/${ROUTE_PARTS.DEVICES}`} component={DeviceListContainer} exact={true}/>
                <Route path={`${url}/${ROUTE_PARTS.DEVICES}/${ROUTE_PARTS.ADD}`} component={AddDeviceContainer} exact={true} />
                <Route path={`${url}/${ROUTE_PARTS.DEVICES}/${ROUTE_PARTS.DETAIL}/`} component={DeviceContentContainer}/>
            </>
        );
    };

    return (
        <div className="app">
            <HeaderContainer />
            <div className="content">
                <SettingsPaneContainer />
                <main role="main">
                    {renderContents()}
                </main>
            </div>
        </div>
    );
};
