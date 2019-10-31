/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { CommandBar } from 'office-ui-fabric-react/lib/CommandBar';
import { RouteComponentProps } from 'react-router-dom';
import DeviceSettingPerInterface from './deviceSettingsPerInterface';
import { TwinWithSchema } from './deviceSettingsPerInterfacePerSetting';
import { LocalizationContextConsumer, LocalizationContextInterface } from '../../../../shared/contexts/localizationContext';
import { ResourceKeys } from '../../../../../localization/resourceKeys';
import { getDeviceIdFromQueryString, getInterfaceIdFromQueryString } from '../../../../shared/utils/queryStringHelper';
import { PatchDigitalTwinInterfacePropertiesActionParameters } from '../../actions';
import InterfaceNotFoundMessageBoxContainer from '../shared/interfaceNotFoundMessageBarContainer';
import { REFRESH } from '../../../../constants/iconNames';
import MultiLineShimmer from '../../../../shared/components/multiLineShimmer';

export interface DeviceSettingsProps extends DeviceInterfaceWithSchema{
    isLoading: boolean;
}

export interface DeviceInterfaceWithSchema {
    interfaceId: string;
    interfaceName: string;
    twinWithSchema: TwinWithSchema[];
}

export interface DeviceSettingDispatchProps {
    refresh: (deviceId: string, interfaceId: string) => void;
    setInterfaceId: (id: string) => void;
    patchDigitalTwinInterfaceProperties: (parameters: PatchDigitalTwinInterfacePropertiesActionParameters) => void;
}

export default class DeviceSettings
    extends React.Component<DeviceSettingsProps & DeviceSettingDispatchProps & RouteComponentProps, {}> {
    constructor(props: DeviceSettingsProps & DeviceSettingDispatchProps & RouteComponentProps) {
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
                                        ariaLabel: context.t(ResourceKeys.deviceSettings.command.refresh),
                                        iconProps: {iconName: REFRESH},
                                        key: REFRESH,
                                        name: context.t(ResourceKeys.deviceSettings.command.refresh),
                                        onClick: this.handleRefresh
                                    }
                                ]}
                        />
                        {this.renderProperties(context)}
                    </>
                )}
            </LocalizationContextConsumer>
        );
    }

    public componentDidMount() {
        this.props.setInterfaceId(getInterfaceIdFromQueryString(this.props));
    }

    private readonly renderProperties = (context: LocalizationContextInterface) => {
        return (
            <>
                <h3>{context.t(ResourceKeys.deviceSettings.headerText)}</h3>
                {this.props.twinWithSchema ?
                    <DeviceSettingPerInterface
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
