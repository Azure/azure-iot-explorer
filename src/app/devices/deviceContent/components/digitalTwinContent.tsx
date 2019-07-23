/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { Route, RouteComponentProps } from 'react-router-dom';
import DeviceSettingsContainer from './deviceSettings/deviceSettingsContainer';
import DeviceCommandsContainer from './deviceCommands/deviceCommandsContainer';
import DeviceInterfacesContainer from './deviceInterfaces/deviceInterfacesContainer';
import DevicePropertiesContainer from './deviceProperties/devicePropertiesContainer';
import DeviceEventsPerInterfaceContainer from './deviceEvents/deviceEventsPerInterfaceContainer';
import { getInterfaceIdFromQueryString, getDeviceIdFromQueryString } from '../../../shared/utils/queryStringHelper';

export interface DigitalTwinContentDispatchProps {
    fetchModelDefinition(deviceId: string, interfaceId: string): void;
}

export class DigitalTwinContent extends React.Component<DigitalTwinContentDispatchProps & RouteComponentProps> {
    public render(): JSX.Element {
        return (
            <>
                <Route path={`${this.props.match.url}/settings/`} component={DeviceSettingsContainer}/>
                <Route path={`${this.props.match.url}/properties/`} component={DevicePropertiesContainer}/>
                <Route path={`${this.props.match.url}/commands/`} component={DeviceCommandsContainer}/>
                <Route path={`${this.props.match.url}/interfaces/`} component={DeviceInterfacesContainer}/>
                <Route path={`${this.props.match.url}/events/`} component={DeviceEventsPerInterfaceContainer}/>
            </>
        );
    }

    public componentDidMount() {
        this.props.fetchModelDefinition(getDeviceIdFromQueryString(this.props), getInterfaceIdFromQueryString(this.props));
    }

    public componentWillReceiveProps(newProps: DigitalTwinContentDispatchProps & RouteComponentProps) {
        const newInterfaceId = getInterfaceIdFromQueryString(newProps);
        if (newInterfaceId !== getInterfaceIdFromQueryString(this.props)) {
            this.props.fetchModelDefinition(getDeviceIdFromQueryString(this.props), newInterfaceId);
        }
    }
}
