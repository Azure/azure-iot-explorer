/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, Routes, Route } from 'react-router-dom';
import { DeviceIdentityInformation } from './deviceIdentity';
import { DeviceTwin } from '../../deviceTwin/components/deviceTwin';
import { DeviceEvents } from '../../deviceEvents/components/deviceEvents';
import { DirectMethod } from '../../directMethod/components/directMethod';
import { CloudToDeviceMessage } from '../../cloudToDeviceMessage/components/cloudToDeviceMessage';
import { DeviceContentNavComponent } from './deviceContentNav';
import { ResourceKeys } from '../../../../localization/resourceKeys';
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
import { DeviceModules } from './deviceModules';
import { CollapsibleButton } from '../../../shared/components/collapsibleButton';
import { DeviceEventsStateContextProvider } from '../../deviceEvents/context/deviceEventsStateProvider';
import '../../../css/_deviceContent.scss';

export const DeviceContent: React.FC = () => {
    const { t } = useTranslation();
    const { search } = useLocation();
    const deviceId = getDeviceIdFromQueryString(search);
    useBreadcrumbEntry({ name: deviceId, disableLink: true });

    const [localState, dispatch] = useAsyncSagaReducer(deviceIdentityReducer, DeviceIdentitySaga, deviceIdentityStateInitial(), 'deviceIdentityState');
    const synchronizationStatus = localState.synchronizationStatus;
    const deviceIdentity = localState.payload;

    const [appMenuVisible, setAppMenuVisible] = React.useState(true);

    React.useEffect(
        () => {
            dispatch(getDeviceIdentityAction.started(deviceId));
        },
        [deviceId, dispatch]);

    const renderNav = () => {
        return (
            <div className={'mainleftnav' + (!appMenuVisible ? ' collapsed' : '')}>
                <div className="nav-links">
                    <CollapsibleButton
                        appMenuVisible={appMenuVisible}
                        setAppMenuVisible={setAppMenuVisible}
                    />
                    {createNavLinks()}
                </div>
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
            <div className="device-content-detail maincontent">
                <Routes>
                    <Route
                        path={`${ROUTE_PARTS.IDENTITY}`}
                        element={
                            <BreadcrumbRoute breadcrumb={{ name: t(ResourceKeys.breadcrumb.identity) }}>
                                {createDeviceIdentityComponent()}
                            </BreadcrumbRoute>
                        }
                    />
                    <Route
                        path={`${ROUTE_PARTS.TWIN}`}
                        element={
                            <BreadcrumbRoute breadcrumb={{ name: t(ResourceKeys.breadcrumb.twin) }}>
                                <DeviceTwin />
                            </BreadcrumbRoute>
                        }
                    />
                    <Route
                        path={`${ROUTE_PARTS.EVENTS}/*`}
                        element={
                            <DeviceEventsStateContextProvider>
                                <BreadcrumbRoute breadcrumb={{ name: t(ResourceKeys.breadcrumb.events) }}>
                                    <DeviceEvents />
                                </BreadcrumbRoute>
                            </DeviceEventsStateContextProvider>
                        }
                    />
                    <Route
                        path={`${ROUTE_PARTS.METHODS}`}
                        element={
                            <BreadcrumbRoute breadcrumb={{ name: t(ResourceKeys.breadcrumb.methods) }}>
                                <DirectMethod />
                            </BreadcrumbRoute>
                        }
                    />
                    <Route
                        path={`${ROUTE_PARTS.CLOUD_TO_DEVICE_MESSAGE}`}
                        element={
                            <BreadcrumbRoute breadcrumb={{ name: t(ResourceKeys.breadcrumb.cloudToDeviceMessage) }}>
                                <CloudToDeviceMessage />
                            </BreadcrumbRoute>
                        }
                    />
                    <Route
                        path={`${ROUTE_PARTS.DIGITAL_TWINS}/*`}
                        element={
                            <BreadcrumbRoute breadcrumb={{ name: t(ResourceKeys.breadcrumb.ioTPlugAndPlay), suffix: `?${ROUTE_PARAMS.DEVICE_ID}=${encodeURIComponent(deviceId)}` }}>
                                <Pnp />
                            </BreadcrumbRoute>
                        }
                    />
                    <Route
                        path={`${ROUTE_PARTS.MODULE_IDENTITY}/*`}
                        element={
                            <BreadcrumbRoute breadcrumb={{ name: t(ResourceKeys.breadcrumb.moduleIdentity), suffix: `?${ROUTE_PARAMS.DEVICE_ID}=${encodeURIComponent(deviceId)}` }}>
                                <DeviceModules />
                            </BreadcrumbRoute>
                        }
                    />
                </Routes>
            </div>
        );
    };

    const createNavLinks = () => {
        return (
            synchronizationStatus === SynchronizationStatus.working ?
                <MultiLineShimmer /> :
                (
                    <DeviceContentNavComponent
                        isEdgeDevice={deviceIdentity && deviceIdentity.capabilities && deviceIdentity.capabilities.iotEdge}
                        appMenuVisible={appMenuVisible}
                    />
                )
        );
    };

    return (
        <>
            {deviceId &&
                <div className={'device-content mainarea' + (!appMenuVisible ? ' collapsed' : '')}>
                    {renderNav()}
                    {renderDeviceContentDetail()}
                </div>
            }
        </>
    );
};
