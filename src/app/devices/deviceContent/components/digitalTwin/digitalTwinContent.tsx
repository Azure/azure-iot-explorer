/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { Route, RouteComponentProps } from 'react-router-dom';
import DeviceSettingsContainer from '../deviceSettings/deviceSettingsContainer';
import DeviceCommandsContainer from '../deviceCommands/deviceCommandsContainer';
import DeviceInterfacesContainer from '../deviceInterfaces/deviceInterfacesContainer';
import DevicePropertiesContainer from '../deviceProperties/devicePropertiesContainer';
import DeviceEventsPerInterfaceContainer from '../deviceEvents/deviceEventsPerInterfaceContainer';
import { getInterfaceIdFromQueryString, getDeviceIdFromQueryString } from '../../../../shared/utils/queryStringHelper';
import { ROUTE_PARTS } from '../../../../constants/routes';

export interface DigitalTwinContentDispatchProps {
    fetchModelDefinition(deviceId: string, interfaceId: string): void;
}

export class DigitalTwinContent extends React.Component<DigitalTwinContentDispatchProps & RouteComponentProps> {
    public render(): JSX.Element {
        return (
            <>
                <Route path={`${this.props.match.url}/${ROUTE_PARTS.SETTINGS}/`} component={DeviceSettingsContainer}/>
                <Route path={`${this.props.match.url}/${ROUTE_PARTS.PROPERTIES}/`} component={DevicePropertiesContainer}/>
                <Route path={`${this.props.match.url}/${ROUTE_PARTS.COMMANDS}/`} component={DeviceCommandsContainer}/>
                <Route path={`${this.props.match.url}/${ROUTE_PARTS.INTERFACES}/`} component={DeviceInterfacesContainer}/>
                <Route path={`${this.props.match.url}/${ROUTE_PARTS.EVENTS}/`} component={DeviceEventsPerInterfaceContainer}/>
            </>
        );
    }

    public componentDidMount() {
        this.props.fetchModelDefinition(getDeviceIdFromQueryString(this.props), getInterfaceIdFromQueryString(this.props));
    }

}
