/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useRouteMatch } from 'react-router-dom';
import { Nav, INavLinkGroup, INavLink } from 'office-ui-fabric-react/lib/components/Nav';
import { ResourceKeys } from '../../../../localization/resourceKeys';
import { ROUTE_PARTS, ROUTE_PARAMS } from '../../../constants/routes';
import { NAVIGATE_BACK } from '../../../constants/iconNames';
import { getDeviceIdFromQueryString, getModuleIdentityIdFromQueryString } from '../../../shared/utils/queryStringHelper';
import '../../../css/_deviceContentNav.scss';

export const NAV_LINK_ITEMS_DEVICE = [ROUTE_PARTS.IDENTITY, ROUTE_PARTS.TWIN, ROUTE_PARTS.EVENTS, ROUTE_PARTS.METHODS, ROUTE_PARTS.CLOUD_TO_DEVICE_MESSAGE, ROUTE_PARTS.MODULE_IDENTITY];
export const NAV_LINK_ITEMS_NONEDGE_DEVICE = [...NAV_LINK_ITEMS_DEVICE, ROUTE_PARTS.DIGITAL_TWINS];
export const NAV_LINK_ITEMS_MODULE = [ROUTE_PARTS.MODULE_DETAIL, ROUTE_PARTS.MODULE_TWIN, ROUTE_PARTS.MODULE_METHOD, ROUTE_PARTS.MODULE_EVENTS, ROUTE_PARTS.MODULE_PNP];
// tslint:disable-next-line: no-any
const navIcons = {} as any;
navIcons[ROUTE_PARTS.IDENTITY] = 'Server';
navIcons[ROUTE_PARTS.TWIN] = 'ReopenPages';
navIcons[ROUTE_PARTS.EVENTS] = 'Message';
navIcons[ROUTE_PARTS.METHODS] = 'Remote';
navIcons[ROUTE_PARTS.CLOUD_TO_DEVICE_MESSAGE] = 'Mail';
navIcons[ROUTE_PARTS.MODULE_IDENTITY] = 'TFVCLogo';
navIcons[ROUTE_PARTS.DIGITAL_TWINS] = 'PlugDisconnected';
navIcons[ROUTE_PARTS.MODULE_DETAIL] = 'TFVCLogo';
navIcons[ROUTE_PARTS.MODULE_TWIN] = 'ReopenPages';
navIcons[ROUTE_PARTS.MODULE_METHOD] = 'Remote';
navIcons[ROUTE_PARTS.MODULE_EVENTS] = 'Message';
navIcons[ROUTE_PARTS.MODULE_PNP] = 'PlugDisconnected';

export interface DeviceContentNavProps {
    isEdgeDevice: boolean;
}

export const DeviceContentNavComponent: React.FC<DeviceContentNavProps> =  (props: DeviceContentNavProps) => {
    const { t } = useTranslation();
    const { isEdgeDevice } = props;
    const { search, pathname } = useLocation();
    const { url } = useRouteMatch();
    const deviceId = getDeviceIdFromQueryString(search);
    const moduleId = getModuleIdentityIdFromQueryString(search);

    const navItems = moduleId ? NAV_LINK_ITEMS_MODULE : (isEdgeDevice ? NAV_LINK_ITEMS_DEVICE : NAV_LINK_ITEMS_NONEDGE_DEVICE);
    const navLinks: INavLink[] = [];

    if (moduleId) {
        navLinks.push({
            iconProps: {iconName: NAVIGATE_BACK},
            key: NAVIGATE_BACK,
            name: t(ResourceKeys.moduleIdentity.detail.command.back),
            url: `#${url}/${ROUTE_PARTS.MODULE_IDENTITY}/?${ROUTE_PARAMS.DEVICE_ID}=${encodeURIComponent(deviceId)}`
        });
        navItems.forEach((nav: string) => {
            const navUrl = `${url}/${ROUTE_PARTS.MODULE_IDENTITY}/${nav}/`;
            navLinks.push({
                iconProps: { iconName: navIcons[nav] },
                key: nav,
                name: t((ResourceKeys.breadcrumb as any)[nav]), // tslint:disable-line:no-any
                url: `#${navUrl}?${ROUTE_PARAMS.DEVICE_ID}=${encodeURIComponent(deviceId)}&${ROUTE_PARAMS.MODULE_ID}=${encodeURIComponent(moduleId)}`
            });
        });
    }

    else {
        navItems.forEach((nav: string) => {
            const navUrl = `${url}/${nav}`;
            navLinks.push({
                iconProps: { iconName: navIcons[nav] },
                key: nav,
                name: t((ResourceKeys.breadcrumb as any)[nav]), // tslint:disable-line:no-any
                url: `#${navUrl}/?${ROUTE_PARAMS.DEVICE_ID}=${encodeURIComponent(deviceId)}`
            });
        });
    }

    const groups: INavLinkGroup[] = [{ links: navLinks }];

    return (
        <div role="navigation">
            <Nav groups={groups}/>
        </div>
    );
};
