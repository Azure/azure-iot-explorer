/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useRouteMatch } from 'react-router-dom';
import { Nav, INavLinkGroup } from 'office-ui-fabric-react/lib/components/Nav';
import { ResourceKeys } from '../../../../localization/resourceKeys';
import { ROUTE_PARTS, ROUTE_PARAMS } from '../../../constants/routes';
import { getDeviceIdFromQueryString } from '../../../shared/utils/queryStringHelper';
import '../../../css/_deviceContentNav.scss';

export const NAV_LINK_ITEMS = [ROUTE_PARTS.IDENTITY, ROUTE_PARTS.TWIN, ROUTE_PARTS.EVENTS, ROUTE_PARTS.METHODS, ROUTE_PARTS.CLOUD_TO_DEVICE_MESSAGE];
export const NAV_LINK_ITEMS_NONEDGE = [...NAV_LINK_ITEMS, ROUTE_PARTS.MODULE_IDENTITY, ROUTE_PARTS.DIGITAL_TWINS];
// tslint:disable-next-line: no-any
const navIcons = {} as any;
navIcons[ROUTE_PARTS.IDENTITY] = 'Server';
navIcons[ROUTE_PARTS.TWIN] = 'ReopenPages';
navIcons[ROUTE_PARTS.EVENTS] = 'Message';
navIcons[ROUTE_PARTS.METHODS] = 'Remote';
navIcons[ROUTE_PARTS.CLOUD_TO_DEVICE_MESSAGE] = 'Mail';
navIcons[ROUTE_PARTS.MODULE_IDENTITY] = 'TFVCLogo';
navIcons[ROUTE_PARTS.DIGITAL_TWINS] = 'PlugDisconnected';

export interface DeviceContentNavProps {
    isEdgeDevice: boolean;
}

export const DeviceContentNavComponent: React.FC<DeviceContentNavProps> =  (props: DeviceContentNavProps) => {
    const { t } = useTranslation();
    const { isEdgeDevice } = props;
    const {  search } = useLocation();
    const { url } = useRouteMatch();
    const deviceId = getDeviceIdFromQueryString(search);

    const navItems = isEdgeDevice ? NAV_LINK_ITEMS : NAV_LINK_ITEMS_NONEDGE;
    const navLinks = navItems.map((nav: string) => ({
        iconProps: { iconName: navIcons[nav] },
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
