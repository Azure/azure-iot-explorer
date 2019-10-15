/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { IconButton } from 'office-ui-fabric-react/lib/Button';
import DeviceCommandsPerInterfacePerCommand, { CommandSchema } from './deviceCommandsPerInterfacePerCommand';
import { InvokeDigitalTwinInterfaceCommandActionParameters } from '../../actions';
import { LocalizationContextConsumer, LocalizationContextInterface } from '../../../../shared/contexts/localizationContext';
import { ResourceKeys } from '../../../../../localization/resourceKeys';
import { InterfaceDetailCard } from '../../../../constants/iconNames';
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
            collapseMap.set(index, false);
        }
        this.state = {
            allCollapsed: false,
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
                    <div className="pnp-detail-list scrollable-lg ms-Grid">
                            <div className="list-header ms-Grid-row">
                                <span className="ms-Grid-col ms-sm3">{context.t(ResourceKeys.deviceCommands.columns.name)}</span>
                                <span className="ms-Grid-col ms-sm3">{context.t(ResourceKeys.deviceCommands.columns.schema.request)}</span>
                                <span className="ms-Grid-col ms-sm3">{context.t(ResourceKeys.deviceCommands.columns.schema.response)}</span>
                                <span className="ms-Grid-col ms-sm2">{context.t(ResourceKeys.deviceCommands.columns.type)}</span>
                                {this.renderCollapseAllButton(context)}
                            </div>
                        <section role={commandSchemas && commandSchemas.length === 0 ? 'main' : 'list'} className="list-content">
                            {commands}
                        </section>
                    </div>
                )}
            </LocalizationContextConsumer>
        );
    }

    private readonly renderCollapseAllButton = (context: LocalizationContextInterface) => {
        return (
            <div className="ms-Grid-col ms-sm1 collapse-button">
                <IconButton
                    iconProps={{iconName: this.state.allCollapsed ? InterfaceDetailCard.OPEN : InterfaceDetailCard.CLOSE}}
                    ariaLabel={this.state.allCollapsed ?
                        context.t(ResourceKeys.deviceCommands.command.expandAll) :
                        context.t(ResourceKeys.deviceCommands.command.collapseAll)}
                    onClick={this.onToggleCollapseAll}
                    title={context.t(this.state.allCollapsed ? ResourceKeys.deviceCommands.command.expandAll : ResourceKeys.deviceCommands.command.collapseAll)}
                />
            </div>
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
