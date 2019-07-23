/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { DefaultButton } from 'office-ui-fabric-react/lib/Button';
import DeviceCommandsPerInterfacePerCommand, { CommandSchema } from './deviceCommandsPerInterfacePerCommand';
import { InvokeDigitalTwinInterfaceCommandActionParameters } from '../../actions';
import { LocalizationContextConsumer, LocalizationContextInterface } from '../../../../shared/contexts/localizationContext';
import { ResourceKeys } from '../../../../../localization/resourceKeys';
import '../../../../css/_devicePnpDetailList.scss';

export interface DeviceCommandDataProps {
    commandSchemas: CommandSchema[];
    deviceId: string;
    interfaceName: string;
}

export interface DeviceCommandDispatchProps {
    invokeDigitalTwinInterfaceCommand: (parameters: InvokeDigitalTwinInterfaceCommandActionParameters) => void;
}

export interface DeviceCommandState {
    collapseMap: Map<number, boolean>;
    allCollapsed: boolean;
}

export default class DeviceCommandsPerInterface
    extends React.Component<DeviceCommandDataProps & DeviceCommandDispatchProps, DeviceCommandState> {
    constructor(props: DeviceCommandDataProps & DeviceCommandDispatchProps) {
        super(props);

        const { commandSchemas } = this.props;
        const collapseMap = new Map();
        for (let index = 0; index < commandSchemas.length; index ++) {
            collapseMap.set(index, true);
        }
        this.state = {
            allCollapsed: true,
            collapseMap
        };
    }

    public render(): JSX.Element {

        const { commandSchemas } = this.props;

        const commands = commandSchemas && commandSchemas.map((schema, index) => (
            <DeviceCommandsPerInterfacePerCommand
                key={index}
                {...this.props}
                {...schema}
                collapsed={this.state.collapseMap.get(index)}
                handleCollapseToggle={this.handleCollapseToggle(index)}
            />
        ));

        return (
            <LocalizationContextConsumer>
                {(context: LocalizationContextInterface) => (
                    <div className="pnp-detail-list">
                        <div className="list-header">
                            <span className="column-name-xl">{context.t(ResourceKeys.deviceCommands.columns.name)}</span>
                            <DefaultButton
                                className="column-toggle"
                                onClick={this.onToggleCollapseAll}
                            >
                                {this.state.allCollapsed ?
                                    context.t(ResourceKeys.deviceCommands.command.expandAll) :
                                    context.t(ResourceKeys.deviceCommands.command.collapseAll)}
                            </DefaultButton>
                        </div>
                        <section role="list" className="list-content scrollable-lg">
                            {commands}
                        </section>
                    </div>
                )}
            </LocalizationContextConsumer>
        );
    }

    private readonly onToggleCollapseAll = () => {
        const allCollapsed = this.state.allCollapsed;
        const collapseMap = new Map();
        for (let index = 0; index < this.state.collapseMap.size; index ++) {
            collapseMap.set(index, !allCollapsed);
        }
        this.setState({allCollapsed: !allCollapsed, collapseMap});
    }

    private readonly handleCollapseToggle = (index: number) => () => {
        const collapseMap = this.state.collapseMap;
        collapseMap.set(index, !collapseMap.get(index));
        this.setState({collapseMap});
    }
}
