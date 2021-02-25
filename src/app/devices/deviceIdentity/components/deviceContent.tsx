/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useRouteMatch } from 'react-router-dom';
import { IconButton } from 'office-ui-fabric-react/lib/components/Button';
import { DeviceIdentityInformation } from './deviceIdentity';
import { DeviceTwin } from '../../deviceTwin/components/deviceTwin';
import { DeviceEvents } from '../../deviceEvents/components/deviceEvents';
import { DirectMethod } from '../../directMethod/components/directMethod';
import { CloudToDeviceMessage } from '../../cloudToDeviceMessage/components/cloudToDeviceMessage';
import { DeviceContentNavComponent } from './deviceContentNav';
import { ResourceKeys } from '../../../../localization/resourceKeys';
import { NAV } from '../../../constants/iconNames';
import { ROUTE_PARAMS, ROUTE_PARTS } from '../../../constants/routes';
import { SynchronizationStatus } from '../../../api/models/synchronizationStatus';
import { MultiLineShimmer } from '../../../shared/components/multiLineShimmer';
import { getDeviceIdFromQueryString } from '../../../shared/utils/queryStringHelper';
import { useAsyncSagaReducer } from '../../../shared/hooks/useAsyncSagaReducer';
import { deviceIdentityReducer } from '../reducer';
import { DeviceIdentitySaga } from '../saga';
import { deviceIdentityStateInitial } from '../state';
import { getDeviceIdentityAction, updateDeviceIdentityAction } from '../actions';
import { useBreadcrumbEntry } from '../../../navigation/hooks/useBreadcrumbEntry';
import { BreadcrumbRoute } from '../../../navigation/components/breadcrumbRoute';
import { DeviceIdentity } from '../../../api/models/deviceIdentity';
import { Pnp } from '../../pnp/components/pnp';
import '../../../css/_deviceContent.scss';
import '../../../css/_layouts.scss';
import { DeviceModules } from './deviceModules';

export const DeviceContent: React.FC = () => {
    const { t } = useTranslation();
    const { search } = useLocation();
    const { url } = useRouteMatch();
    const deviceId = getDeviceIdFromQueryString(search);
    useBreadcrumbEntry({name: deviceId, disableLink: true});

    const [ localState, dispatch ] = useAsyncSagaReducer(deviceIdentityReducer, DeviceIdentitySaga, deviceIdentityStateInitial(), 'deviceIdentityState');
    const synchronizationStatus = localState.synchronizationStatus;
    const deviceIdentity = localState.payload;

    const [ appMenuVisible, setAppMenuVisible ] = React.useState(true);

    React.useEffect(() => {
        dispatch(getDeviceIdentityAction.started(deviceId));
    },              [deviceId]);

    const renderNav = () => {
        return (
            <div className={'device-content-nav-bar' + (!appMenuVisible ? ' collapsed' : '')}>
                <nav>
                    <div className="navToggle">
                        <IconButton
                            tabIndex={0}
                            iconProps={{ iconName: NAV }}
                            title={appMenuVisible ? t(ResourceKeys.common.navigation.collapse) : t(ResourceKeys.common.navigation.expand)}
                            ariaLabel={appMenuVisible ? t(ResourceKeys.common.navigation.collapse) : t(ResourceKeys.common.navigation.expand)}
                            onClick={collapseToggle}
                        />
                    </div>
                    <div className="nav-links">
                        {createNavLinks()}
                    </div>
                </nav>
            </div>
        );
    };

    const updateDeviceIdentity = (deviceIdentityToUpdate: DeviceIdentity) => {
        dispatch(updateDeviceIdentityAction.started(deviceIdentityToUpdate));
    };

    const createDeviceIdentityComponent = () => {
        return (
            <DeviceIdentityInformation
                deviceIdentity={deviceIdentity}
                synchronizationStatus={synchronizationStatus}
                updateDeviceIdentity={updateDeviceIdentity}
            />);
    };

    const renderDeviceContentDetail = () => {
        return (
            <div className={'device-content-detail' + (!appMenuVisible ? ' collapsed' : '')}>
                <BreadcrumbRoute
                    path={`${url}/${ROUTE_PARTS.IDENTITY}`}
                    breadcrumb={{ name: t(ResourceKeys.breadcrumb.identity)}}
                    children={createDeviceIdentityComponent()}
                />

                <BreadcrumbRoute
                    path={`${url}/${ROUTE_PARTS.TWIN}`}
                    breadcrumb={{ name: t(ResourceKeys.breadcrumb.twin)}}
                    children={<DeviceTwin/>}
                />

                <BreadcrumbRoute
                    path={`${url}/${ROUTE_PARTS.EVENTS}`}
                    breadcrumb={{name: t(ResourceKeys.breadcrumb.events)}}
                    children={<DeviceEvents/>}
                />

                <BreadcrumbRoute
                    path={`${url}/${ROUTE_PARTS.METHODS}`}
                    breadcrumb={{name: t(ResourceKeys.breadcrumb.methods)}}
                    children={<DirectMethod/>}
                />

                <BreadcrumbRoute
                    path={`${url}/${ROUTE_PARTS.CLOUD_TO_DEVICE_MESSAGE}`}
                    breadcrumb={{name: t(ResourceKeys.breadcrumb.cloudToDeviceMessage)}}
                    children={<CloudToDeviceMessage/>}
                />

                <BreadcrumbRoute
                    path={`${url}/${ROUTE_PARTS.DIGITAL_TWINS}`}
                    breadcrumb={{name: t(ResourceKeys.breadcrumb.ioTPlugAndPlay), suffix: `?${ROUTE_PARAMS.DEVICE_ID}=${encodeURIComponent(deviceId)}`}}
                    children={<Pnp/>}
                />

                <BreadcrumbRoute
                    path={`${url}/${ROUTE_PARTS.MODULE_IDENTITY}`}
                    breadcrumb={{name: t(ResourceKeys.breadcrumb.moduleIdentity), suffix: `?${ROUTE_PARAMS.DEVICE_ID}=${encodeURIComponent(deviceId)}` }}
                    children={<DeviceModules/>}
                />
            </div>
        );
    };

    const collapseToggle = () => {
        setAppMenuVisible(!appMenuVisible);
    };

    const createNavLinks = () => {
        return (
            synchronizationStatus === SynchronizationStatus.working ?
                <MultiLineShimmer/> :
                (
                    <DeviceContentNavComponent
                        isEdgeDevice={deviceIdentity && deviceIdentity.capabilities && deviceIdentity.capabilities.iotEdge}
                    />
                )
        );
    };

    return (
        <div>
            {deviceId &&
                <div className="edit-content">
                    <div className="device-content">
                        {renderNav()}
                        {renderDeviceContentDetail()}
                    </div>
                </div>
            }
        </div>
    );
};
