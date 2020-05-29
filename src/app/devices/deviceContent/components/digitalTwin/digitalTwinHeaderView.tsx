/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Stack } from 'office-ui-fabric-react/lib/Stack';
import { ActionButton } from 'office-ui-fabric-react/lib/Button';
import { useLocalizationContext } from '../../../../shared/contexts/localizationContext';
import { ROUTE_PARTS, ROUTE_PARAMS } from '../../../../constants/routes';
import { ResourceKeys } from '../../../../../localization/resourceKeys';
import { getDeviceIdFromQueryString, getComponentNameFromQueryString, getInterfaceIdFromQueryString } from '../../../../shared/utils/queryStringHelper';
import '../../../../css/_pivotHeader.scss';

export const DigitalTwinHeaderView: React.FC = () => {
    const { t } = useLocalizationContext();
    const { search, pathname } = useLocation();

    const NAV_LINK_ITEMS_PNP = [ROUTE_PARTS.INTERFACES, ROUTE_PARTS.PROPERTIES, ROUTE_PARTS.SETTINGS, ROUTE_PARTS.COMMANDS, ROUTE_PARTS.EVENTS];
    const deviceId = getDeviceIdFromQueryString(search);
    const componentName = getComponentNameFromQueryString(search);
    const interfaceId = getInterfaceIdFromQueryString(search);

    const pivotItems = NAV_LINK_ITEMS_PNP.map(nav =>  {
        const text = t((ResourceKeys.deviceContent.navBar as any)[nav]); // tslint:disable-line:no-any
        const path = pathname.replace(/\/ioTPlugAndPlayDetail\/.*/, `/${ROUTE_PARTS.DIGITAL_TWINS_DETAIL}`);
        const url = `#${path}/${nav}/?${ROUTE_PARAMS.DEVICE_ID}=${encodeURIComponent(deviceId)}&${ROUTE_PARAMS.COMPONENT_NAME}=${componentName}&${ROUTE_PARAMS.INTERFACE_ID}=${interfaceId}`;
        const isCurrentPivot = pathname.indexOf(nav) > 0;
        return (
            <Stack.Item className={`pivot-item ${isCurrentPivot ? 'pivot-item-active' : ''}`} key={nav}>
                <ActionButton href={url} >
                    {text}
                </ActionButton>
            </Stack.Item>
        );
    });

    return (
        <Stack horizontal={true} className="pivot">
            {pivotItems}
        </Stack>
    );
};
