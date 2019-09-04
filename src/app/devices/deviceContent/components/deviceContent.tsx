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
import DeviceMethodsContainer from './deviceMethods/deviceMethodsContainer';
import DeviceContentNavComponent from './deviceContentNav';
import BreadcrumbContainer from '../../../shared/components/breadcrumbContainer';
import DigitalTwinsContentContainer from './digitalTwinContentContainer';
import { ResourceKeys } from '../../../../localization/resourceKeys';
import { LocalizationContextConsumer, LocalizationContextInterface } from '../../../shared/contexts/localizationContext';
import { NAV_OPEN, NAV_CLOSED } from '../../../constants/iconNames';
import '../../../css/_deviceContent.scss';
import '../../../css/_layouts.scss';

interface DeviceContentState {
    appMenuVisible: boolean;
}
export interface DeviceContentDataProps {
    interfaceIds: string[];
    isLoading: boolean;
    isPnPDevice: boolean;
}

export interface DeviceContentProps extends DeviceContentDataProps {
    deviceId: string;
    interfaceId: string;
}

export interface DeviceContentDispatchProps {
    setInterfaceId: (interfaceId: string) => void;
    getDigitalTwinInterfaceProperties: (deviceId: string) => void;
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
    }

    private readonly renderNav = (context: LocalizationContextInterface) => {
        return (
            <div className={'device-content-nav-bar' + (!this.state.appMenuVisible ? ' collapsed' : '')}>
                <nav>
                    <div className="navToggle">
                        <IconButton
                            tabIndex={0}
                            iconProps={{ iconName: this.state.appMenuVisible ? NAV_OPEN : NAV_CLOSED }}
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
                <Route path="/devices/detail/identity/" component={DeviceIdentityContainer} />
                <Route path="/devices/detail/twin/" component={DeviceTwinContainer} />
                <Route path="/devices/detail/events/" component={DeviceEventsContainer}/>
                <Route path="/devices/detail/methods/" component={DeviceMethodsContainer} />
                <Route path="/devices/detail/digitalTwins/" component={DigitalTwinsContentContainer} />
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
            <DeviceContentNavComponent
                {...this.props}
                selectedInterface={this.props.interfaceId}
            />);
    }
}
