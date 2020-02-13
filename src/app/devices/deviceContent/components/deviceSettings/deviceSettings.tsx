/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { CommandBar } from 'office-ui-fabric-react/lib/CommandBar';
import { Label } from 'office-ui-fabric-react/lib/components/Label';
import { RouteComponentProps, Route } from 'react-router-dom';
import DeviceSettingPerInterface from './deviceSettingsPerInterface';
import { TwinWithSchema } from './deviceSettingsPerInterfacePerSetting';
import { LocalizationContextConsumer, LocalizationContextInterface } from '../../../../shared/contexts/localizationContext';
import { ResourceKeys } from '../../../../../localization/resourceKeys';
import { getDeviceIdFromQueryString, getInterfaceIdFromQueryString, getComponentNameFromQueryString } from '../../../../shared/utils/queryStringHelper';
import { PatchDigitalTwinInterfacePropertiesActionParameters } from '../../actions';
import InterfaceNotFoundMessageBoxContainer from '../shared/interfaceNotFoundMessageBarContainer';
import { REFRESH, NAVIGATE_BACK } from '../../../../constants/iconNames';
import MultiLineShimmer from '../../../../shared/components/multiLineShimmer';
import { DigitalTwinHeaderContainer } from '../digitalTwin/digitalTwinHeaderView';
import { ROUTE_PARAMS } from '../../../../constants/routes';

export interface DeviceSettingsProps extends DeviceInterfaceWithSchema{
    isLoading: boolean;
}

export interface DeviceInterfaceWithSchema {
    interfaceId: string;
    componentName: string;
    twinWithSchema: TwinWithSchema[];
}

export interface DeviceSettingDispatchProps {
    refresh: (deviceId: string, interfaceId: string) => void;
    setComponentName: (id: string) => void;
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
                                farItems={[
                                    {
                                        ariaLabel: context.t(ResourceKeys.deviceSettings.command.close),
                                        iconProps: {iconName: NAVIGATE_BACK},
                                        key: NAVIGATE_BACK,
                                        name: context.t(ResourceKeys.deviceSettings.command.close),
                                        onClick: this.handleClose
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
        this.props.setComponentName(getComponentNameFromQueryString(this.props));
    }

    private readonly renderProperties = (context: LocalizationContextInterface) => {
        const { twinWithSchema } = this.props;
        return (
            <>
                <Route component={DigitalTwinHeaderContainer} />
                {twinWithSchema ?
                    twinWithSchema.length === 0 ?
                        <Label className="no-pnp-content">{context.t(ResourceKeys.deviceSettings.noSettings, {componentName: getComponentNameFromQueryString(this.props)})}</Label> :
                        <DeviceSettingPerInterface
                            {...this.props}
                            deviceId={getDeviceIdFromQueryString(this.props)}
                        />
                    : <InterfaceNotFoundMessageBoxContainer/>
                }
            </>
        );
    }

    private readonly handleRefresh = () => {
        this.props.refresh(getDeviceIdFromQueryString(this.props), getInterfaceIdFromQueryString(this.props));
    }

    private readonly handleClose = () => {
        const path = this.props.match.url.replace(/\/digitalTwinsDetail\/settings\/.*/, ``);
        const deviceId = getDeviceIdFromQueryString(this.props);
        this.props.history.push(`${path}/?${ROUTE_PARAMS.DEVICE_ID}=${encodeURIComponent(deviceId)}`);
    }
}
