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
import CloudToDeviceMessageContainer from './cloudToDeviceMessage/cloudToDeviceMessageContainer';
import { ModuleIdentityRoutes } from '../../module/components/moduleIdentity/moduleIdentityContent';
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
        return (
            <div className={'device-content-detail' + (!appMenuVisible ? ' collapsed' : '')}>
                <Route path={`${url}/${ROUTE_PARTS.IDENTITY}`} component={DeviceIdentityContainer} />
                <Route path={`${url}/${ROUTE_PARTS.TWIN}`} component={DeviceTwin} />
                <Route path={`${url}/${ROUTE_PARTS.EVENTS}`} component={DeviceEvents}/>
                <Route path={`${url}/${ROUTE_PARTS.METHODS}`} component={DirectMethod} />
                <Route path={`${url}/${ROUTE_PARTS.CLOUD_TO_DEVICE_MESSAGE}`} component={CloudToDeviceMessageContainer} />
                <Route path={`${url}/${ROUTE_PARTS.MODULE_IDENTITY}`} component={ModuleIdentityRoutes} />
                <Route exact={true} path={`${url}/${ROUTE_PARTS.DIGITAL_TWINS}`} component={DigitalTwinInterfacesContainer} />
                <Route path={`${url}/${ROUTE_PARTS.DIGITAL_TWINS}/${ROUTE_PARTS.DIGITAL_TWINS_DETAIL}`} component={DigitalTwinContent}/>
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
