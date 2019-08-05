/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { DefaultButton, Overlay } from 'office-ui-fabric-react';
import DeviceSettingPerInterfacePerSetting, { TwinWithSchema } from './deviceSettingsPerInterfacePerSetting';
import { LocalizationContextConsumer, LocalizationContextInterface } from '../../../../shared/contexts/localizationContext';
import { ResourceKeys } from '../../../../../localization/resourceKeys';
import { PatchDigitalTwinInterfacePropertiesActionParameters } from '../../actions';
import '../../../../css/_devicePnpDetailList.scss';

export interface DeviceSettingDataProps {
    deviceId: string;
    interfaceId: string;
    interfaceName: string;
    twinWithSchema: TwinWithSchema[];
}

export interface DeviceSettingDispatchProps {
    patchDigitalTwinInterfaceProperties: (parameters: PatchDigitalTwinInterfacePropertiesActionParameters) => void;
}

export interface DeviceSettingState {
    collapseMap: Map<number, boolean>;
    allCollapsed: boolean;
    showOverlay: boolean;
}

export default class DeviceSettingsPerInterface
    extends React.Component<DeviceSettingDataProps & DeviceSettingDispatchProps, DeviceSettingState> {
    constructor(props: DeviceSettingDataProps & DeviceSettingDispatchProps) {
        super(props);

        const { twinWithSchema } = this.props;
        const collapseMap = new Map();
        for (let index = 0; index < twinWithSchema.length; index ++) {
            collapseMap.set(index, false);
        }
        this.state = {
            allCollapsed: false,
            collapseMap,
            showOverlay: false
        };
    }

    public render(): JSX.Element {
        const { twinWithSchema} = this.props;

        const settings = twinWithSchema && twinWithSchema.map((tuple, index) => (
            <DeviceSettingPerInterfacePerSetting
                key={index}
                {...tuple}
                {...this.props}
                collapsed={this.state.collapseMap.get(index)}
                handleCollapseToggle={this.handleCollapseToggle(index)}
                handleOverlayToggle={this.handleOverlayToggle}
            />
        ));

        return (
            <LocalizationContextConsumer>
                {(context: LocalizationContextInterface) => (
                    <div className="pnp-detail-list">
                        <div className="list-header">
                            <span className="column-name">{context.t(ResourceKeys.deviceSettings.columns.name)}</span>
                            <span className="column-schema-sm">{context.t(ResourceKeys.deviceSettings.columns.schema)}</span>
                            <span className="column-unit">{context.t(ResourceKeys.deviceSettings.columns.unit)}</span>
                            <span className="column-value">{context.t(ResourceKeys.deviceSettings.columns.reportedValue)}</span>
                            <DefaultButton
                                className="column-toggle"
                                onClick={this.onToggleCollapseAll}
                            >
                                {this.state.allCollapsed ?
                                    context.t(ResourceKeys.deviceSettings.command.expandAll) :
                                    context.t(ResourceKeys.deviceSettings.command.collapseAll)}
                            </DefaultButton>
                        </div>
                        <section role="list" className="list-content scrollable-lg">
                            {settings}
                        </section>
                        {this.state.showOverlay && <Overlay/>}
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

    private readonly handleOverlayToggle = () => {
        this.setState({showOverlay: !this.state.showOverlay});
    }
}
