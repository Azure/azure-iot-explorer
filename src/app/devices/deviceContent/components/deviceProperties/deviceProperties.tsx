/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { RouteComponentProps, Route } from 'react-router-dom';
import { CommandBar } from 'office-ui-fabric-react/lib/CommandBar';
import { Label } from 'office-ui-fabric-react/lib/components/Label';
import { LocalizationContextConsumer, LocalizationContextInterface } from '../../../../shared/contexts/localizationContext';
import { ResourceKeys } from '../../../../../localization/resourceKeys';
import { getInterfaceIdFromQueryString, getDeviceIdFromQueryString, getComponentNameFromQueryString } from '../../../../shared/utils/queryStringHelper';
import DevicePropertiesPerInterface, { TwinWithSchema } from './devicePropertiesPerInterface';
import { REFRESH, NAVIGATE_BACK } from '../../../../constants/iconNames';
import MultiLineShimmer from '../../../../shared/components/multiLineShimmer';
import { DigitalTwinHeaderContainer } from '../digitalTwin/digitalTwinHeaderView';
import { ROUTE_PARAMS } from '../../../../constants/routes';

export interface DevicePropertiesDataProps {
    twinAndSchema: TwinWithSchema[];
    isLoading: boolean;
}

export interface DevicePropertiesDispatchProps {
    setComponentName: (id: string) => void;
    refresh: (deviceId: string, interfaceId: string) => void;
}

export default class DeviceProperties
    extends React.Component<DevicePropertiesDataProps & DevicePropertiesDispatchProps & RouteComponentProps, {}> {
    constructor(props: DevicePropertiesDataProps & DevicePropertiesDispatchProps & RouteComponentProps) {
        super(props);
    }

    public render(): JSX.Element {
        if (this.props.isLoading) {
            return  <MultiLineShimmer/>;
        }

        return (
            <LocalizationContextConsumer>
                {(context: LocalizationContextInterface) => (
                    <>
                        <CommandBar
                                className="command"
                                items={[
                                    {
                                        ariaLabel: context.t(ResourceKeys.deviceProperties.command.refresh),
                                        iconProps: {iconName: REFRESH},
                                        key: REFRESH,
                                        name: context.t(ResourceKeys.deviceProperties.command.refresh),
                                        onClick: this.handleRefresh
                                    }
                                ]}
                                farItems={[
                                    {
                                        ariaLabel: context.t(ResourceKeys.deviceProperties.command.close),
                                        iconProps: {iconName: NAVIGATE_BACK},
                                        key: NAVIGATE_BACK,
                                        name: context.t(ResourceKeys.deviceProperties.command.close),
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
        const { twinAndSchema } = this.props;
        return (
            <>
                <Route component={DigitalTwinHeaderContainer} />
                {twinAndSchema && twinAndSchema.length === 0 ?
                    <Label className="no-pnp-content">{context.t(ResourceKeys.deviceProperties.noProperties, {componentName: getComponentNameFromQueryString(this.props)})}</Label> :
                    <DevicePropertiesPerInterface twinAndSchema={twinAndSchema} />
                }
            </>
        );
    }

    private readonly handleRefresh = () => {
        this.props.refresh(getDeviceIdFromQueryString(this.props), getInterfaceIdFromQueryString(this.props));
    }

    private readonly handleClose = () => {
        const path = this.props.match.url.replace(/\/ioTPlugAndPlayDetail\/properties\/.*/, ``);
        const deviceId = getDeviceIdFromQueryString(this.props);
        this.props.history.push(`${path}/?${ROUTE_PARAMS.DEVICE_ID}=${encodeURIComponent(deviceId)}`);
    }
}
