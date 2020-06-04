/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { Route, useLocation, useRouteMatch } from 'react-router-dom';
import { IconButton } from 'office-ui-fabric-react/lib/Button';
import DeviceIdentityContainer from './deviceIdentity/deviceIdentityContainer';
import { DeviceTwin } from '../deviceTwin/components/deviceTwin';
import { DeviceEvents } from '../deviceEvents/components/deviceEvents';
import { DirectMethod } from '../directMethod/components/directMethod';
import { CloudToDeviceMessage } from '../cloudToDeviceMessage/components/cloudToDeviceMessage';
import { DeviceContentNavComponent } from './deviceContentNav';
import { DigitalTwinContent } from './digitalTwin/digitalTwinContent';
import { DigitalTwinInterfacesContainer } from './digitalTwin/digitalTwinInterfaces';
import { ResourceKeys } from '../../../../localization/resourceKeys';
import { useLocalizationContext } from '../../../shared/contexts/localizationContext';
import { NAV } from '../../../constants/iconNames';
import { ROUTE_PARTS } from '../../../constants/routes';
import { DeviceIdentity } from '../../../api/models/deviceIdentity';
import { SynchronizationWrapper } from '../../../api/models/synchronizationWrapper';
import { SynchronizationStatus } from '../../../api/models/synchronizationStatus';
import MultiLineShimmer from '../../../shared/components/multiLineShimmer';
import { getDeviceIdFromQueryString } from '../../../shared/utils/queryStringHelper';
import { ModuleIdentityTwin } from '../../module/moduleIdentityTwin/components/moduleIdentityTwin';
import { AddModuleIdentity } from '../../module/addModuleIdentity/components/addModuleIdentity';
import { ModuleIdentityList } from '../../module/moduleIdentityList/components/moduleIdentityList';
import { ModuleIdentityDetail } from '../../module/moduleIndentityDetail/components/moduleIdentityDetail';
import '../../../css/_deviceContent.scss';
import '../../../css/_layouts.scss';

export interface DeviceContentDataProps {
    isLoading: boolean;
    digitalTwinModelId: string;
    identityWrapper: SynchronizationWrapper<DeviceIdentity>;
}

export interface DeviceContentDispatchProps {
    setComponentName: (componentName: string) => void;
    getDigitalTwin: (deviceId: string) => void;
    getDeviceIdentity: (deviceId: string) => void;
}

export type DeviceContentProps = DeviceContentDataProps & DeviceContentDispatchProps;

export const DeviceContentComponent: React.FC<DeviceContentProps> = (props: DeviceContentProps) => {
    const { identityWrapper, getDeviceIdentity, getDigitalTwin } = props;
    const { t } = useLocalizationContext();
    const { url } = useRouteMatch();
    const { search } = useLocation();
    const deviceId = getDeviceIdFromQueryString(search);
    const [ appMenuVisible, setAppMenuVisible ] = React.useState(true);

    React.useEffect(() => {
        getDigitalTwin(deviceId);
        getDeviceIdentity(deviceId);
    },              [deviceId]);

    const renderNav = () => {
        return (
            <div className={'device-content-nav-bar' + (!appMenuVisible ? ' collapsed' : '')}>
                <nav>
                    <div className="navToggle">
                        <IconButton
                            tabIndex={0}
                            iconProps={{ iconName: NAV }}
                            title={appMenuVisible ? t(ResourceKeys.deviceContent.navBar.collapse) : t(ResourceKeys.deviceContent.navBar.expand)}
                            ariaLabel={appMenuVisible ? t(ResourceKeys.deviceContent.navBar.collapse) : t(ResourceKeys.deviceContent.navBar.expand)}
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

    const renderDeviceContentDetail = () => {
        const currentRoutePath = `/${ROUTE_PARTS.RESOURCE}/:hostName/${ROUTE_PARTS.DEVICES}/${ROUTE_PARTS.DEVICE_DETAIL}`;
        return (
            <div className={'device-content-detail' + (!appMenuVisible ? ' collapsed' : '')}>
                <Route path={`${currentRoutePath}/${ROUTE_PARTS.IDENTITY}`} component={DeviceIdentityContainer} />
                <Route path={`${currentRoutePath}/${ROUTE_PARTS.TWIN}`} component={DeviceTwin} />
                <Route path={`${currentRoutePath}/${ROUTE_PARTS.EVENTS}`} component={DeviceEvents}/>
                <Route path={`${currentRoutePath}/${ROUTE_PARTS.METHODS}`} component={DirectMethod} />
                <Route path={`${currentRoutePath}/${ROUTE_PARTS.CLOUD_TO_DEVICE_MESSAGE}`} component={CloudToDeviceMessage} />
                <Route exact={true} path={`${currentRoutePath}/${ROUTE_PARTS.DIGITAL_TWINS}`} component={DigitalTwinInterfacesContainer} />
                <Route path={`${currentRoutePath}/${ROUTE_PARTS.DIGITAL_TWINS}/${ROUTE_PARTS.DIGITAL_TWINS_DETAIL}`} component={DigitalTwinContent}/>
                {/* module Routes */}
                <Route exact={true} path={`${currentRoutePath}/${ROUTE_PARTS.MODULE_IDENTITY}`} component={ModuleIdentityList}/>
                <Route exact={true} path={`${currentRoutePath}/${ROUTE_PARTS.MODULE_IDENTITY}/${ROUTE_PARTS.ADD}`} component={AddModuleIdentity}/>
                <Route exact={true} path={`${currentRoutePath}/${ROUTE_PARTS.MODULE_IDENTITY}/${ROUTE_PARTS.MODULE_DETAIL}`} component={ModuleIdentityDetail}/>
                <Route exact={true} path={`${currentRoutePath}/${ROUTE_PARTS.MODULE_IDENTITY}/${ROUTE_PARTS.MODULE_TWIN}`} component={ModuleIdentityTwin}/>
            </div>
        );
    };

    const collapseToggle = () => {
        setAppMenuVisible(true);
    };

    const createNavLinks = () => {
        return (
            identityWrapper && identityWrapper.synchronizationStatus === SynchronizationStatus.working ?
                <MultiLineShimmer/> :
                (
                    <DeviceContentNavComponent
                        {...props}
                        isEdgeDevice={identityWrapper && identityWrapper.payload && identityWrapper.payload.capabilities.iotEdge}
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
