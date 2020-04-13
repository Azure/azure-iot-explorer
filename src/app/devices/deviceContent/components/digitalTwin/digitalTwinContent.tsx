/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { useDispatch } from 'react-redux';
import { Route, RouteComponentProps } from 'react-router-dom';
import DeviceSettingsContainer from '../deviceSettings/deviceSettingsContainer';
import DeviceCommandsContainer from '../deviceCommands/deviceCommandsContainer';
import DeviceInterfacesContainer from '../deviceInterfaces/deviceInterfacesContainer';
import DevicePropertiesContainer from '../deviceProperties/devicePropertiesContainer';
import DeviceEventsPerInterfaceContainer from '../deviceEvents/deviceEventsPerInterfaceContainer';
import { getInterfaceIdFromQueryString, getDeviceIdFromQueryString } from '../../../../shared/utils/queryStringHelper';
import { ROUTE_PARTS } from '../../../../constants/routes';
import { getModelDefinitionAction } from '../../actions';

export interface DigitalTwinContentProps extends RouteComponentProps{
    deviceId: string;
    interfaceId: string;
}

export const DigitalTwinContent: React.FC<DigitalTwinContentProps> = props => {
    const dispatch = useDispatch();
    const { deviceId, interfaceId } = props;
    React.useEffect(() => {
        dispatch(getModelDefinitionAction.started({digitalTwinId: deviceId, interfaceId}));
    }, [interfaceId, deviceId]);  // tslint:disable-line:align

    return (
        <>
            <Route path={`${props.match.url}/${ROUTE_PARTS.SETTINGS}/`} component={DeviceSettingsContainer}/>
            <Route path={`${props.match.url}/${ROUTE_PARTS.PROPERTIES}/`} component={DevicePropertiesContainer}/>
            <Route path={`${props.match.url}/${ROUTE_PARTS.COMMANDS}/`} component={DeviceCommandsContainer}/>
            <Route path={`${props.match.url}/${ROUTE_PARTS.INTERFACES}/`} component={DeviceInterfacesContainer}/>
            <Route path={`${props.match.url}/${ROUTE_PARTS.EVENTS}/`} component={DeviceEventsPerInterfaceContainer}/>
        </>
    );
};

export type DigitalTwinContentContainerProps = RouteComponentProps;
export const DigitalTwinContentContainer: React.FC<DigitalTwinContentContainerProps> = props => {
    const viewProps = {
        deviceId: getDeviceIdFromQueryString(props),
        interfaceId: getInterfaceIdFromQueryString(props),
        ...props
    };
    return <DigitalTwinContent {...viewProps} />;
};
