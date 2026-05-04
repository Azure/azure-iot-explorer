/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import { TabList, Tab } from '@fluentui/react-components';
import {
    ServerRegular,
    DocumentCopyRegular,
    ChatMultipleRegular,
    RemoteRegular,
    MailRegular,
    BranchForkRegular,
    PlugDisconnectedRegular,
    ArrowLeftRegular,
} from '@fluentui/react-icons';
import { ResourceKeys } from '../../../../localization/resourceKeys';
import { ROUTE_PARTS, ROUTE_PARAMS } from '../../../constants/routes';
import { NAVIGATE_BACK } from '../../../constants/iconNames';
import { getDeviceIdFromQueryString, getModuleIdentityIdFromQueryString } from '../../../shared/utils/queryStringHelper';
import './deviceContentNav.scss';
import { LiveRegion } from '../../../shared/components/liveRegion';

export const NAV_LINK_ITEMS_DEVICE = [ROUTE_PARTS.IDENTITY, ROUTE_PARTS.TWIN, ROUTE_PARTS.EVENTS, ROUTE_PARTS.METHODS, ROUTE_PARTS.CLOUD_TO_DEVICE_MESSAGE, ROUTE_PARTS.MODULE_IDENTITY];
export const NAV_LINK_ITEMS_NONEDGE_DEVICE = [...NAV_LINK_ITEMS_DEVICE, ROUTE_PARTS.DIGITAL_TWINS];
export const NAV_LINK_ITEMS_MODULE = [ROUTE_PARTS.MODULE_DETAIL, ROUTE_PARTS.MODULE_TWIN, ROUTE_PARTS.MODULE_METHOD, ROUTE_PARTS.MODULE_EVENTS, ROUTE_PARTS.MODULE_PNP];

const navIcons: Record<string, React.ReactElement> = {};
navIcons[ROUTE_PARTS.IDENTITY] = <ServerRegular />;
navIcons[ROUTE_PARTS.TWIN] = <DocumentCopyRegular />;
navIcons[ROUTE_PARTS.EVENTS] = <ChatMultipleRegular />;
navIcons[ROUTE_PARTS.METHODS] = <RemoteRegular />;
navIcons[ROUTE_PARTS.CLOUD_TO_DEVICE_MESSAGE] = <MailRegular />;
navIcons[ROUTE_PARTS.MODULE_IDENTITY] = <BranchForkRegular />;
navIcons[ROUTE_PARTS.DIGITAL_TWINS] = <PlugDisconnectedRegular />;
navIcons[ROUTE_PARTS.MODULE_DETAIL] = <BranchForkRegular />;
navIcons[ROUTE_PARTS.MODULE_TWIN] = <DocumentCopyRegular />;
navIcons[ROUTE_PARTS.MODULE_METHOD] = <RemoteRegular />;
navIcons[ROUTE_PARTS.MODULE_EVENTS] = <ChatMultipleRegular />;
navIcons[ROUTE_PARTS.MODULE_PNP] = <PlugDisconnectedRegular />;

interface NavLink {
    icon: React.ReactElement;
    key: string;
    name: string;
    url: string;
}

export interface DeviceContentNavProps {
    isEdgeDevice: boolean;
    appMenuVisible?: boolean;
}

export const DeviceContentNavComponent: React.FC<DeviceContentNavProps> =  (props: DeviceContentNavProps) => {
    const { t } = useTranslation();
    const { isEdgeDevice, appMenuVisible = true } = props;
    const { search, pathname } = useLocation();
    const url = pathname.replace(/\/(identity|twin|events|methods|cloudToDeviceMessage|ioTPlugAndPlay|moduleIdentity)(\/.*)?$/, '');
    const [ selectedRoute, setSelectedRoute] = React.useState<string>();
    const deviceId = getDeviceIdFromQueryString(search);
    const moduleId = getModuleIdentityIdFromQueryString(search);

    const navItems = moduleId ? NAV_LINK_ITEMS_MODULE : (isEdgeDevice ? NAV_LINK_ITEMS_DEVICE : NAV_LINK_ITEMS_NONEDGE_DEVICE);
    const navLinks: NavLink[] = [];

    if (moduleId) {
        navLinks.push({
            icon: <ArrowLeftRegular />,
            key: NAVIGATE_BACK,
            name: t(ResourceKeys.moduleIdentity.detail.command.back),
            url: `#${url}/${ROUTE_PARTS.MODULE_IDENTITY}/?${ROUTE_PARAMS.DEVICE_ID}=${encodeURIComponent(deviceId)}`
        });
        navItems.forEach((nav: string) => {
            const navUrl = `${url}/${ROUTE_PARTS.MODULE_IDENTITY}/${nav}/`;
            navLinks.push({
                icon: navIcons[nav],
                key: nav,
                name: t((ResourceKeys.breadcrumb as any)[nav]),
                url: `#${navUrl}?${ROUTE_PARAMS.DEVICE_ID}=${encodeURIComponent(deviceId)}&${ROUTE_PARAMS.MODULE_ID}=${encodeURIComponent(moduleId)}`
            });
        });
    }

    else {
        navItems.forEach((nav: string) => {
            const navUrl = `${url}/${nav}`;
            navLinks.push({
                icon: navIcons[nav],
                key: nav,
                name: t((ResourceKeys.breadcrumb as any)[nav]),
                url: `#${navUrl}/?${ROUTE_PARAMS.DEVICE_ID}=${encodeURIComponent(deviceId)}`
            });
        });
    }

    React.useEffect(() => {
        const foundRoutes = navItems.filter(nav => pathname.includes(nav));
        const currentRoute = foundRoutes?.[foundRoutes.length - 1] ?? '';
        setSelectedRoute(currentRoute);
    }, [pathname]); // tslint:disable-line: align

    return (
        <div role="navigation" className={`nav-link-left ${appMenuVisible ? '' : 'nav-collapsed'}`}>
            <TabList vertical appearance="subtle" selectedValue={selectedRoute}>
                {navLinks.map(link => (
                    <Tab
                        key={link.key}
                        value={link.key}
                        icon={link.icon}
                        as="a"
                        {...{ href: link.url } as any}
                    >
                        {appMenuVisible ? link.name : undefined}
                    </Tab>
                ))}
            </TabList>
            {selectedRoute && <LiveRegion message={`${t(ResourceKeys.breadcrumb.navigate)} ${selectedRoute}`}/>}
        </div>
    );
};
