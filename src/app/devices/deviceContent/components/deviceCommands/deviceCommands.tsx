/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { Shimmer } from 'office-ui-fabric-react/lib/Shimmer';
import { CommandBar } from 'office-ui-fabric-react/lib/CommandBar';
import { RouteComponentProps } from 'react-router-dom';
import DeviceCommandPerInterface from './deviceCommandsPerInterface';
import { LocalizationContextConsumer, LocalizationContextInterface } from '../../../../shared/contexts/localizationContext';
import { ResourceKeys } from '../../../../../localization/resourceKeys';
import { InvokeDigitalTwinInterfaceCommandActionParameters } from '../../actions';
import { getDeviceIdFromQueryString, getInterfaceIdFromQueryString } from '../../../../shared/utils/queryStringHelper';
import { CommandSchema } from './deviceCommandsPerInterfacePerCommand';
import InterfaceNotFoundMessageBoxContainer from '../shared/interfaceNotFoundMessageBarContainer';
import { REFRESH } from '../../../../constants/iconNames';

export interface DeviceCommandsProps extends DeviceInterfaceWithSchema{
    isLoading: boolean;
}

export interface DeviceInterfaceWithSchema {
    interfaceName: string;
    commandSchemas: CommandSchema[];
}

export interface DeviceCommandDispatchProps {
    refresh: (deviceId: string, interfaceId: string) => void;
    invokeDigitalTwinInterfaceCommand: (parameters: InvokeDigitalTwinInterfaceCommandActionParameters) => void;
    setInterfaceId: (id: string) => void;
}

export default class DeviceCommands
    extends React.Component<DeviceCommandsProps & DeviceCommandDispatchProps & RouteComponentProps> {
    constructor(props: DeviceCommandsProps & DeviceCommandDispatchProps & RouteComponentProps) {
        super(props);
    }

    public render(): JSX.Element {
        if (this.props.isLoading) {
            return (
                <Shimmer/>
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
                                    ariaLabel: context.t(ResourceKeys.deviceSettings.command.refresh),
                                    iconProps: {iconName: REFRESH},
                                    key: REFRESH,
                                    name: context.t(ResourceKeys.deviceSettings.command.refresh),
                                    onClick: this.handleRefresh
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
        this.props.setInterfaceId(getInterfaceIdFromQueryString(this.props));
    }

    private readonly renderCommandsPerInterface = (context: LocalizationContextInterface) => {
        return (
            <>
                <h3>{context.t(ResourceKeys.deviceCommands.headerText)}</h3>
                { this.props.commandSchemas ?
                    <DeviceCommandPerInterface
                        {...this.props}
                        deviceId={getDeviceIdFromQueryString(this.props)}
                    /> :
                    <InterfaceNotFoundMessageBoxContainer/>
                }
            </>
        );
    }

    private readonly handleRefresh = () => {
        this.props.refresh(getDeviceIdFromQueryString(this.props), getInterfaceIdFromQueryString(this.props));
    }
}
