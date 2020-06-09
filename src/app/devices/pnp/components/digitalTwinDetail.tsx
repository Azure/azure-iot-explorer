/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { useLocation, Route, useRouteMatch } from 'react-router-dom';
import { Stack } from 'office-ui-fabric-react/lib/components/Stack';
import { ActionButton } from 'office-ui-fabric-react/lib/components/Button';
import { useLocalizationContext } from '../../../shared/contexts/localizationContext';
import { ROUTE_PARTS, ROUTE_PARAMS } from '../../../constants/routes';
import { ResourceKeys } from '../../../../localization/resourceKeys';
import { DeviceSettings } from './deviceSettings/deviceSettings';
import { DeviceProperties } from './deviceProperties/deviceProperties';
import { DeviceCommands } from './deviceCommands/deviceCommands';
import { DeviceInterfaces } from './deviceInterfaces/deviceInterfaces';
import { DeviceEventsPerInterface } from './deviceEvents/deviceEventsPerInterface';
import { getDeviceIdFromQueryString, getInterfaceIdFromQueryString, getComponentNameFromQueryString } from '../../../shared/utils/queryStringHelper';
import { usePnpStateContext } from '../../../shared/contexts/pnpStateContext';
import '../../../css/_pivotHeader.scss';

export const DigitalTwinDetail: React.FC = () => {
    const { t } = useLocalizationContext();
    const { search, pathname } = useLocation();
    const { url } = useRouteMatch();
    const { pnpState, dispatch, getModelDefinition } = usePnpStateContext();
    const deviceId = getDeviceIdFromQueryString(search);
    const interfaceId = getInterfaceIdFromQueryString(search);
    const componentName = getComponentNameFromQueryString(search);

    const NAV_LINK_ITEMS_PNP = [ROUTE_PARTS.INTERFACES, ROUTE_PARTS.PROPERTIES, ROUTE_PARTS.SETTINGS, ROUTE_PARTS.COMMANDS, ROUTE_PARTS.EVENTS];

    React.useEffect(() => {
        getModelDefinition();
    },              []);

    const pivotItems = NAV_LINK_ITEMS_PNP.map(nav =>  {
        const text = t((ResourceKeys.deviceContent.navBar as any)[nav]); // tslint:disable-line:no-any
        const path = pathname.replace(/\/ioTPlugAndPlayDetail\/.*/, `/${ROUTE_PARTS.DIGITAL_TWINS_DETAIL}`);
        const linkUrl = `#${path}/${nav}/?${ROUTE_PARAMS.DEVICE_ID}=${encodeURIComponent(deviceId)}&${ROUTE_PARAMS.COMPONENT_NAME}=${componentName}&${ROUTE_PARAMS.INTERFACE_ID}=${interfaceId}`;
        const isCurrentPivot = pathname.indexOf(nav) > 0;
        return (
            <Stack.Item className={`pivot-item ${isCurrentPivot ? 'pivot-item-active' : ''}`} key={nav}>
                <ActionButton href={linkUrl} >
                    {text}
                </ActionButton>
            </Stack.Item>
        );
    });

    return (
        <>
            <Stack horizontal={true} className="pivot">
                {pivotItems}
            </Stack>
            <Route path={`${url}/${ROUTE_PARTS.SETTINGS}/`} component={DeviceSettings}/>
            <Route path={`${url}/${ROUTE_PARTS.PROPERTIES}/`} component={DeviceProperties}/>
            <Route path={`${url}/${ROUTE_PARTS.COMMANDS}/`} component={DeviceCommands}/>
            <Route path={`${url}/${ROUTE_PARTS.INTERFACES}/`} component={DeviceInterfaces}/>
            <Route path={`${url}/${ROUTE_PARTS.EVENTS}/`} component={DeviceEventsPerInterface}/>
        </>
    );
};
