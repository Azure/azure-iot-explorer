/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { RouteComponentProps, Route } from 'react-router-dom';
import { CommandBar } from 'office-ui-fabric-react/lib/CommandBar';
import { LocalizationContextConsumer, LocalizationContextInterface } from '../../../../shared/contexts/localizationContext';
import { ResourceKeys } from '../../../../../localization/resourceKeys';
import { getInterfaceIdFromQueryString, getDeviceIdFromQueryString } from '../../../../shared/utils/queryStringHelper';
import DevicePropertiesPerInterface, { TwinWithSchema } from './devicePropertiesPerInterface';
import InterfaceNotFoundMessageBoxContainer from '../shared/interfaceNotFoundMessageBarContainer';
import { REFRESH } from '../../../../constants/iconNames';
import MultiLineShimmer from '../../../../shared/components/multiLineShimmer';
import { DigitalTwinHeaderContainer } from '../digitalTwin/digitalTwinHeaderView';

export interface DevicePropertiesDataProps {
    twinAndSchema: TwinWithSchema[];
    isLoading: boolean;
}

export interface DevicePropertiesDispatchProps {
    setInterfaceId: (id: string) => void;
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
                        />
                        {this.renderProperties()}
                    </>
                )}
            </LocalizationContextConsumer>
        );
    }

    public componentDidMount() {
        this.props.setInterfaceId(getInterfaceIdFromQueryString(this.props));
    }

    private readonly renderProperties = () => {
        const { twinAndSchema } = this.props;
        return (
            <>
                <Route component={DigitalTwinHeaderContainer} />
                {twinAndSchema ?
                    <DevicePropertiesPerInterface
                        twinAndSchema={twinAndSchema}
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
