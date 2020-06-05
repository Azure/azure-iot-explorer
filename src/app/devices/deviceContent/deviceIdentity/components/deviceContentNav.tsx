/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { useLocation, useRouteMatch } from 'react-router-dom';
import { Nav, INavLinkGroup } from 'office-ui-fabric-react/lib/Nav';
import { useLocalizationContext } from '../../../../shared/contexts/localizationContext';
import { ResourceKeys } from '../../../../../localization/resourceKeys';
import { ROUTE_PARTS, ROUTE_PARAMS } from '../../../../constants/routes';
import { getDeviceIdFromQueryString } from '../../../../shared/utils/queryStringHelper';
import '../../../../css/_deviceContentNav.scss';

export interface DeviceContentNavDataProps {
    isEdgeDevice: boolean;
}

export const NAV_LINK_ITEMS = [ROUTE_PARTS.IDENTITY, ROUTE_PARTS.TWIN, ROUTE_PARTS.EVENTS, ROUTE_PARTS.METHODS, ROUTE_PARTS.CLOUD_TO_DEVICE_MESSAGE];
export const NAV_LINK_ITEMS_NONEDGE = [...NAV_LINK_ITEMS, ROUTE_PARTS.MODULE_IDENTITY, ROUTE_PARTS.DIGITAL_TWINS];

export type DeviceContentNavProps = DeviceContentNavDataProps;
export const DeviceContentNavComponent: React.FC<DeviceContentNavProps> =  (props: DeviceContentNavProps) => {
    const { t } = useLocalizationContext();
    const { isEdgeDevice } = props;
    const {  search } = useLocation();
    const { url } = useRouteMatch();
    const deviceId = getDeviceIdFromQueryString(search);

    const navItems = isEdgeDevice ? NAV_LINK_ITEMS : NAV_LINK_ITEMS_NONEDGE;
    const navLinks = navItems.map((nav: string) => ({
        key: nav,
        name: t((ResourceKeys.deviceContent.navBar as any)[nav]), // tslint:disable-line:no-any
        url: `#${url}/${nav}/?${ROUTE_PARAMS.DEVICE_ID}=${encodeURIComponent(deviceId)}`
    }));

    const groups: INavLinkGroup[] = [{ links: navLinks }];

    return (
        <div role="navigation">
            <Nav groups={groups}/>
        </div>
    );
};
