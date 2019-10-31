/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { Route } from 'react-router-dom';
import { IconButton } from 'office-ui-fabric-react/lib/Button';
import DeviceIdentityContainer from './deviceIdentity/deviceIdentityContainer';
import DeviceTwinContainer from './deviceTwin/deviceTwinContainer';
import DeviceEventsContainer from './deviceEvents/deviceEventsContainer';
import DirectMethodContainer from './directMethod/directMethodContainer';
import CloudToDeviceMessageContainer from './cloudToDeviceMessage/cloudToDeviceMessageContainer';
import ModuleIdentityContainer from './moduleIdentity/moduleIdentityContainer';
import DeviceContentNavComponent from './deviceContentNav';
import BreadcrumbContainer from '../../../shared/components/breadcrumbContainer';
import DigitalTwinsContentContainer from './digitalTwinContentContainer';
import { ResourceKeys } from '../../../../localization/resourceKeys';
import { LocalizationContextConsumer, LocalizationContextInterface } from '../../../shared/contexts/localizationContext';
import { NAV } from '../../../constants/iconNames';
import { ROUTE_PARTS } from '../../../constants/routes';
import { DeviceIdentityWrapper } from '../../../api/models/deviceIdentityWrapper';
import { SynchronizationStatus } from '../../../api/models/synchronizationStatus';
import MultiLineShimmer from '../../../shared/components/multiLineShimmer';
import '../../../css/_deviceContent.scss';
import '../../../css/_layouts.scss';

interface DeviceContentState {
    appMenuVisible: boolean;
}
export interface DeviceContentDataProps {
    interfaceIds: string[];
    isLoading: boolean;
    isPnPDevice: boolean;
    identityWrapper: DeviceIdentityWrapper;
}

export interface DeviceContentProps extends DeviceContentDataProps {
    deviceId: string;
    interfaceId: string;
}

export interface DeviceContentDispatchProps {
    setInterfaceId: (interfaceId: string) => void;
    getDigitalTwinInterfaceProperties: (deviceId: string) => void;
    getDeviceIdentity: (deviceId: string) => void;
}

export class DeviceContentComponent extends React.PureComponent<DeviceContentProps & DeviceContentDispatchProps, DeviceContentState> {
    constructor(props: DeviceContentProps & DeviceContentDispatchProps) {
        super(props);
        this.state = {
            appMenuVisible: true
        };
    }

    public render(): JSX.Element {
        return (
            <LocalizationContextConsumer>
            {(context: LocalizationContextInterface) => (
                <div className="edit">
                    <div className="view-header">
                        <Route component={BreadcrumbContainer} />
                    </div>
                    {this.props.deviceId &&
                        <div className="view-content view-scroll">
                            <div className="device-content">
                                <>
                                    {this.renderNav(context)}
                                    {this.renderDeviceContentDetail()}
                                </>
                            </div>
                        </div>
                    }
                </div>
            )}
            </LocalizationContextConsumer>
        );
    }

    public componentDidMount() {
        this.props.getDigitalTwinInterfaceProperties(this.props.deviceId);
        this.props.getDeviceIdentity(this.props.deviceId);
    }

    private readonly renderNav = (context: LocalizationContextInterface) => {
        return (
            <div className={'device-content-nav-bar' + (!this.state.appMenuVisible ? ' collapsed' : '')}>
                <nav>
                    <div className="navToggle">
                        <IconButton
                            tabIndex={0}
                            iconProps={{ iconName: NAV }}
                            title={this.state.appMenuVisible ? context.t(ResourceKeys.deviceContent.navBar.collapse) : context.t(ResourceKeys.deviceContent.navBar.expand)}
                            ariaLabel={this.state.appMenuVisible ? context.t(ResourceKeys.deviceContent.navBar.collapse) : context.t(ResourceKeys.deviceContent.navBar.expand)}
                            onClick={this.collapseToggle}
                        />
                    </div>
                    <div className="nav-links">
                        {this.createNavLinks()}
                    </div>
                </nav>
            </div>
        );
    }

    private readonly renderDeviceContentDetail = () => {
        return (
            <div className={'device-content-detail' + (!this.state.appMenuVisible ? ' collapsed' : '')}>
                <Route path={`/${ROUTE_PARTS.DEVICES}/${ROUTE_PARTS.DETAIL}/${ROUTE_PARTS.IDENTITY}/`} component={DeviceIdentityContainer} />
                <Route path={`/${ROUTE_PARTS.DEVICES}/${ROUTE_PARTS.DETAIL}/${ROUTE_PARTS.TWIN}/`} component={DeviceTwinContainer} />
                <Route path={`/${ROUTE_PARTS.DEVICES}/${ROUTE_PARTS.DETAIL}/${ROUTE_PARTS.EVENTS}/`} component={DeviceEventsContainer}/>
                <Route path={`/${ROUTE_PARTS.DEVICES}/${ROUTE_PARTS.DETAIL}/${ROUTE_PARTS.METHODS}/`} component={DirectMethodContainer} />
                <Route path={`/${ROUTE_PARTS.DEVICES}/${ROUTE_PARTS.DETAIL}/${ROUTE_PARTS.CLOUD_TO_DEVICE_MESSAGE}/`} component={CloudToDeviceMessageContainer} />
                <Route path={`/${ROUTE_PARTS.DEVICES}/${ROUTE_PARTS.DETAIL}/${ROUTE_PARTS.MODULE_IDENTITY}/`} component={ModuleIdentityContainer} />
                <Route path={`/${ROUTE_PARTS.DEVICES}/${ROUTE_PARTS.DETAIL}/${ROUTE_PARTS.DIGITAL_TWINS}/`} component={DigitalTwinsContentContainer} />
            </div>
        );
    }

    private readonly collapseToggle = () => {
        this.setState({
            appMenuVisible: !this.state.appMenuVisible
        });
    }

    private readonly createNavLinks = () => {
        return (
            this.props.identityWrapper && this.props.identityWrapper.deviceIdentitySynchronizationStatus === SynchronizationStatus.working ?
                <MultiLineShimmer/> :
                (
                    <DeviceContentNavComponent
                        {...this.props}
                        isEdgeDevice={this.props.identityWrapper && this.props.identityWrapper.deviceIdentity && this.props.identityWrapper.deviceIdentity.capabilities.iotEdge}
                        selectedInterface={this.props.interfaceId}
                    />
                )
        );
    }
}
