/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { CommandBar } from 'office-ui-fabric-react/lib/CommandBar';
import { LocalizationContextConsumer, LocalizationContextInterface } from '../../../../shared/contexts/localizationContext';
import { ResourceKeys } from '../../../../../localization/resourceKeys';
import { TwinWithSchema } from './devicePropertiesPerInterfacePerProperty';
import { getInterfaceIdFromQueryString, getDeviceIdFromQueryString } from '../../../../shared/utils/queryStringHelper';
import DevicePropertiesPerInterface from './devicePropertiesPerInterface';
import InterfaceNotFoundMessageBoxContainer from '../shared/interfaceNotFoundMessageBarContainer';
import { REFRESH } from '../../../../constants/iconNames';
import MultiLineShimmer from '../../../../shared/components/multiLineShimmer';

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
        const { twinAndSchema } = this.props;
        return (
            <>
                <h3>{context.t(ResourceKeys.deviceProperties.headerText)}</h3>
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
