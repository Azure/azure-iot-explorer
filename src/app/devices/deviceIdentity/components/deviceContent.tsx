/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { Route, useLocation } from 'react-router-dom';
import { IconButton } from 'office-ui-fabric-react/lib/components/Button';
import { DeviceIdentityInformation } from './deviceIdentity';
import { DeviceTwin } from '../../deviceTwin/components/deviceTwin';
import { DeviceEvents } from '../../deviceEvents/components/deviceEvents';
import { DirectMethod } from '../../directMethod/components/directMethod';
import { CloudToDeviceMessage } from '../../cloudToDeviceMessage/components/cloudToDeviceMessage';
import { DeviceContentNavComponent } from './deviceContentNav';
import { ResourceKeys } from '../../../../localization/resourceKeys';
import { NAV } from '../../../constants/iconNames';
import { ROUTE_PARTS } from '../../../constants/routes';
import { SynchronizationStatus } from '../../../api/models/synchronizationStatus';
import { MultiLineShimmer } from '../../../shared/components/multiLineShimmer';
import { getDeviceIdFromQueryString } from '../../../shared/utils/queryStringHelper';
import { ModuleIdentityTwin } from '../../module/moduleIdentityTwin/components/moduleIdentityTwin';
import { AddModuleIdentity } from '../../module/addModuleIdentity/components/addModuleIdentity';
import { ModuleIdentityList } from '../../module/moduleIdentityList/components/moduleIdentityList';
import { ModuleIdentityDetail } from '../../module/moduleIndentityDetail/components/moduleIdentityDetail';
import { useAsyncSagaReducer } from '../../../shared/hooks/useAsyncSagaReducer';
import { deviceIdentityReducer } from '../reducer';
import { DeviceIdentitySaga } from '../saga';
import { deviceIdentityStateInitial } from '../state';
import { getDeviceIdentityAction, updateDeviceIdentityAction } from '../actions';
import { DeviceIdentity } from '../../../api/models/deviceIdentity';
import { Pnp } from '../../pnp/components/pnp';
import '../../../css/_deviceContent.scss';
import '../../../css/_layouts.scss';

export const DeviceContent: React.FC = () => {
    const { t } = useTranslation();
    const { search } = useLocation();
    const deviceId = getDeviceIdFromQueryString(search);

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
        const currentRoutePath = `/${ROUTE_PARTS.RESOURCE}/:hostName/${ROUTE_PARTS.DEVICES}/${ROUTE_PARTS.DEVICE_DETAIL}`;
        return (
            <div className={'device-content-detail' + (!appMenuVisible ? ' collapsed' : '')}>
                <Route path={`${currentRoutePath}/${ROUTE_PARTS.IDENTITY}`} component={createDeviceIdentityComponent} />
                <Route path={`${currentRoutePath}/${ROUTE_PARTS.TWIN}`} component={DeviceTwin} />
                <Route path={`${currentRoutePath}/${ROUTE_PARTS.EVENTS}`} component={DeviceEvents}/>
                <Route path={`${currentRoutePath}/${ROUTE_PARTS.METHODS}`} component={DirectMethod} />
                <Route path={`${currentRoutePath}/${ROUTE_PARTS.CLOUD_TO_DEVICE_MESSAGE}`} component={CloudToDeviceMessage} />
                <Route path={`${currentRoutePath}/${ROUTE_PARTS.DIGITAL_TWINS}`} component={Pnp} />
                {/* module Routes */}
                <Route exact={true} path={`${currentRoutePath}/${ROUTE_PARTS.MODULE_IDENTITY}`} component={ModuleIdentityList}/>
                <Route exact={true} path={`${currentRoutePath}/${ROUTE_PARTS.MODULE_IDENTITY}/${ROUTE_PARTS.ADD}`} component={AddModuleIdentity}/>
                <Route exact={true} path={`${currentRoutePath}/${ROUTE_PARTS.MODULE_IDENTITY}/${ROUTE_PARTS.MODULE_DETAIL}`} component={ModuleIdentityDetail}/>
                <Route exact={true} path={`${currentRoutePath}/${ROUTE_PARTS.MODULE_IDENTITY}/${ROUTE_PARTS.MODULE_TWIN}`} component={ModuleIdentityTwin}/>
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
