/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { IconButton } from 'office-ui-fabric-react/lib/Button';
import { Overlay } from 'office-ui-fabric-react/lib/Overlay';
import { TooltipHost } from 'office-ui-fabric-react/lib/Tooltip';
import { getId } from 'office-ui-fabric-react/lib/Utilities';
import DeviceSettingPerInterfacePerSetting, { TwinWithSchema } from './deviceSettingsPerInterfacePerSetting';
import { LocalizationContextConsumer, LocalizationContextInterface } from '../../../../shared/contexts/localizationContext';
import { ResourceKeys } from '../../../../../localization/resourceKeys';
import { PatchDigitalTwinInterfacePropertiesActionParameters } from '../../actions';
import { INFO, InterfaceDetailCard } from '../../../../constants/iconNames';
import '../../../../css/_devicePnpDetailList.scss';

export interface DeviceSettingDataProps {
    deviceId: string;
    interfaceId: string;
    componentName: string;
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

    private tooltipHostId = getId('tooltipHost');

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
                    <div className="pnp-detail-list scrollable-lg ms-Grid">
                        <div className="list-header ms-Grid-row">
                            <span className="ms-Grid-col ms-sm3">{context.t(ResourceKeys.deviceSettings.columns.name)}</span>
                            <span className="ms-Grid-col ms-sm2">{context.t(ResourceKeys.deviceSettings.columns.schema)}</span>
                            <span className="ms-Grid-col ms-sm2">{context.t(ResourceKeys.deviceSettings.columns.unit)}</span>
                            <span className="ms-Grid-col ms-sm4 reported-value">
                                {context.t(ResourceKeys.deviceSettings.columns.reportedValue)}
                                <TooltipHost
                                    content={context.t(ResourceKeys.deviceSettings.columns.reportedValueTooltip)}
                                    calloutProps={{ gapSpace: 0 }}
                                    styles={{ root: { display: 'inline-flex'} }}
                                    id={this.tooltipHostId}
                                >
                                    <IconButton
                                        iconProps={{ iconName: INFO }}
                                        aria-labelledby={this.tooltipHostId}
                                    />
                                </TooltipHost>
                            </span>
                            {this.renderCollapseAllButton(context)}
                        </div>
                        <section role={twinWithSchema && twinWithSchema.length === 0 ? 'main' : 'list'} className="list-content">
                            {settings}
                        </section>
                        {this.state.showOverlay && <Overlay/>}
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
                        context.t(ResourceKeys.deviceSettings.command.expandAll) :
                        context.t(ResourceKeys.deviceSettings.command.collapseAll)}
                    onClick={this.onToggleCollapseAll}
                    title={context.t(this.state.allCollapsed ? ResourceKeys.deviceSettings.command.expandAll : ResourceKeys.deviceSettings.command.collapseAll)}
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

    private readonly handleOverlayToggle = () => {
        this.setState({showOverlay: !this.state.showOverlay});
    }
}
