/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { useDispatch } from 'react-redux';
import { Route, useLocation } from 'react-router-dom';
import DeviceSettingsContainer from '../deviceSettings/deviceSettingsContainer';
import DeviceCommandsContainer from '../deviceCommands/deviceCommandsContainer';
import DeviceInterfacesContainer from '../deviceInterfaces/deviceInterfacesContainer';
import DevicePropertiesContainer from '../deviceProperties/devicePropertiesContainer';
import DeviceEventsPerInterfaceContainer from '../deviceEvents/deviceEventsPerInterfaceContainer';
import { getInterfaceIdFromQueryString, getDeviceIdFromQueryString } from '../../../../shared/utils/queryStringHelper';
import { ROUTE_PARTS } from '../../../../constants/routes';
import { getModelDefinitionAction } from '../../actions';

export const DigitalTwinContent: React.FC = () => {
    const dispatch = useDispatch();
    const { pathname, search } = useLocation();
    const deviceId = getDeviceIdFromQueryString(search);
    const interfaceId = getInterfaceIdFromQueryString(search);

    React.useEffect(() => {
        dispatch(getModelDefinitionAction.started({digitalTwinId: deviceId, interfaceId}));
    }, [interfaceId, deviceId]);  // tslint:disable-line:align

    return (
        <>
            <Route path={`${pathname}/${ROUTE_PARTS.SETTINGS}/`} component={DeviceSettingsContainer}/>
            <Route path={`${pathname}/${ROUTE_PARTS.PROPERTIES}/`} component={DevicePropertiesContainer}/>
            <Route path={`${pathname}/${ROUTE_PARTS.COMMANDS}/`} component={DeviceCommandsContainer}/>
            <Route path={`${pathname}/${ROUTE_PARTS.INTERFACES}/`} component={DeviceInterfacesContainer}/>
            <Route path={`${pathname}/${ROUTE_PARTS.EVENTS}/`} component={DeviceEventsPerInterfaceContainer}/>
        </>
    );
};
