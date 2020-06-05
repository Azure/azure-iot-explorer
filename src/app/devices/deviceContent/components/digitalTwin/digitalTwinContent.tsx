/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { useDispatch } from 'react-redux';
import { Route, useLocation, useRouteMatch } from 'react-router-dom';
import DeviceSettingsContainer from '../deviceSettings/deviceSettingsContainer';
import DeviceCommandsContainer from '../deviceCommands/deviceCommandsContainer';
import DeviceInterfacesContainer from '../deviceInterfaces/deviceInterfacesContainer';
import DevicePropertiesContainer from '../deviceProperties/devicePropertiesContainer';
import DeviceEventsPerInterfaceContainer from '../deviceEvents/deviceEventsPerInterfaceContainer';
import { getInterfaceIdFromQueryString, getDeviceIdFromQueryString } from '../../../../shared/utils/queryStringHelper';
import { ROUTE_PARTS } from '../../../../constants/routes';
import { getModelDefinitionAction, getDigitalTwinAction } from '../../actions';

export const DigitalTwinContent: React.FC = () => {
    const dispatch = useDispatch();
    const { search } = useLocation();
    const { url } = useRouteMatch();
    const deviceId = getDeviceIdFromQueryString(search);
    const interfaceId = getInterfaceIdFromQueryString(search);

    React.useEffect(() => {
        dispatch(getModelDefinitionAction.started({digitalTwinId: deviceId, interfaceId}));
        dispatch(getDigitalTwinAction.started(deviceId));
    },              [interfaceId, deviceId]);

    return (
        <>
            <Route path={`${url}/${ROUTE_PARTS.SETTINGS}/`} component={DeviceSettingsContainer}/>
            <Route path={`${url}/${ROUTE_PARTS.PROPERTIES}/`} component={DevicePropertiesContainer}/>
            <Route path={`${url}/${ROUTE_PARTS.COMMANDS}/`} component={DeviceCommandsContainer}/>
            <Route path={`${url}/${ROUTE_PARTS.INTERFACES}/`} component={DeviceInterfacesContainer}/>
            <Route path={`${url}/${ROUTE_PARTS.EVENTS}/`} component={DeviceEventsPerInterfaceContainer}/>
        </>
    );
};
