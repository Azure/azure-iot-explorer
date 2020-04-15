/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { CommandBar } from 'office-ui-fabric-react/lib/CommandBar';
import { Label } from 'office-ui-fabric-react/lib/Label';
import { RouteComponentProps, Route } from 'react-router-dom';
import DeviceCommandPerInterface from './deviceCommandsPerInterface';
import { LocalizationContextConsumer, LocalizationContextInterface } from '../../../../shared/contexts/localizationContext';
import { ResourceKeys } from '../../../../../localization/resourceKeys';
import { InvokeDigitalTwinInterfaceCommandActionParameters } from '../../actions';
import { getDeviceIdFromQueryString, getInterfaceIdFromQueryString, getComponentNameFromQueryString } from '../../../../shared/utils/queryStringHelper';
import { CommandSchema } from './deviceCommandsPerInterfacePerCommand';
import { REFRESH, NAVIGATE_BACK } from '../../../../constants/iconNames';
import MultiLineShimmer from '../../../../shared/components/multiLineShimmer';
import { DigitalTwinHeaderContainer } from '../digitalTwin/digitalTwinHeaderView';
import { ROUTE_PARAMS } from '../../../../constants/routes';

export interface DeviceCommandsProps extends DeviceInterfaceWithSchema{
    isLoading: boolean;
}

export interface DeviceInterfaceWithSchema {
    commandSchemas: CommandSchema[];
}

export interface DeviceCommandDispatchProps {
    refresh: (deviceId: string, interfaceId: string) => void;
    invokeDigitalTwinInterfaceCommand: (parameters: InvokeDigitalTwinInterfaceCommandActionParameters) => void;
    setComponentName: (id: string) => void;
}

export default class DeviceCommands
    extends React.Component<DeviceCommandsProps & DeviceCommandDispatchProps & RouteComponentProps> {
    constructor(props: DeviceCommandsProps & DeviceCommandDispatchProps & RouteComponentProps) {
        super(props);
    }

    public render(): JSX.Element {
        if (this.props.isLoading) {
            return (
                <MultiLineShimmer/>
            );
        }

        return (
            <LocalizationContextConsumer>
                {(context: LocalizationContextInterface) => (
                    <>
                        <CommandBar
                            className="command"
                            items={[
                                {
                                    ariaLabel: context.t(ResourceKeys.deviceCommands.command.refresh),
                                    iconProps: {iconName: REFRESH},
                                    key: REFRESH,
                                    name: context.t(ResourceKeys.deviceCommands.command.refresh),
                                    onClick: this.handleRefresh
                                }
                            ]}
                            farItems={[
                                {
                                    ariaLabel: context.t(ResourceKeys.deviceCommands.command.close),
                                    iconProps: {iconName: NAVIGATE_BACK},
                                    key: NAVIGATE_BACK,
                                    name: context.t(ResourceKeys.deviceCommands.command.close),
                                    onClick: this.handleClose
                                }
                            ]}
                        />
                        {this.renderCommandsPerInterface(context)}
                    </>
                )}
            </LocalizationContextConsumer>
        );
    }

    public componentDidMount() {
        this.props.setComponentName(getComponentNameFromQueryString(this.props));
    }

    private readonly renderCommandsPerInterface = (context: LocalizationContextInterface) => {
        const { commandSchemas } = this.props;
        return (
            <>
                <Route component={DigitalTwinHeaderContainer} />
                {!commandSchemas || commandSchemas.length === 0 ?
                    <Label className="no-pnp-content">{context.t(ResourceKeys.deviceCommands.noCommands, {componentName: getComponentNameFromQueryString(this.props)})}</Label> :
                    <DeviceCommandPerInterface
                        {...this.props}
                        componentName={getComponentNameFromQueryString(this.props)}
                        deviceId={getDeviceIdFromQueryString(this.props)}
                    />
                }
            </>
        );
    }

    private readonly handleRefresh = () => {
        this.props.refresh(getDeviceIdFromQueryString(this.props), getInterfaceIdFromQueryString(this.props));
    }

    private readonly handleClose = () => {
        const path = this.props.match.url.replace(/\/ioTPlugAndPlayDetail\/commands\/.*/, ``);
        const deviceId = getDeviceIdFromQueryString(this.props);
        this.props.history.push(`${path}/?${ROUTE_PARAMS.DEVICE_ID}=${encodeURIComponent(deviceId)}`);
    }
}
