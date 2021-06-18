/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { Nav, INavLink } from 'office-ui-fabric-react/lib/components/Nav';
import { IconButton } from 'office-ui-fabric-react/lib/components/Button';
import { NAV } from '../../constants/iconNames';
import { ROUTE_PARTS } from '../../constants/routes';
import { ResourceKeys } from '../../../localization/resourceKeys';
import '../../css/_layouts.scss';
import './homeViewNavigation.scss';

export interface HomeViewNavigationProps {
    appMenuVisible: boolean;
    setAppMenuVisible: (appMenuVisible: boolean) => void;
}
export const HomeViewNavigation: React.FC<HomeViewNavigationProps> = props => {
    const { t } = useTranslation();
    const { appMenuVisible, setAppMenuVisible } = props;
    const collapseToggle = () => {
        setAppMenuVisible(!appMenuVisible);
    };

    const navLinks: INavLink[] = [
        {
            iconProps: { iconName: 'Org' },
            key: ROUTE_PARTS.RESOURCES,
            name: t(ResourceKeys.breadcrumb.resources),
            url: `#/${ROUTE_PARTS.HOME}/${ROUTE_PARTS.RESOURCES}`
        },
        {
            iconProps: { iconName: 'PlugDisconnected' },
            key: ROUTE_PARTS.MODEL_REPOS,
            name: t(ResourceKeys.breadcrumb.repos),
            url: `#/${ROUTE_PARTS.HOME}/${ROUTE_PARTS.MODEL_REPOS}`
        },
        {
            iconProps: { iconName: 'Ringer' },
            key: ROUTE_PARTS.NOTIFICATIONS,
            name: t(ResourceKeys.breadcrumb.notificationCenter),
            url: `#/${ROUTE_PARTS.HOME}/${ROUTE_PARTS.NOTIFICATIONS}`
        },
    ];
    return (
        <div className="nav-link-bar view">
            <div className="view-scroll-vertical">
                <IconButton
                    tabIndex={0}
                    iconProps={{ iconName: NAV }}
                    title={appMenuVisible ? t(ResourceKeys.common.navigation.collapse) : t(ResourceKeys.common.navigation.expand)}
                    ariaLabel={appMenuVisible ? t(ResourceKeys.common.navigation.collapse) : t(ResourceKeys.common.navigation.expand)}
                    onClick={collapseToggle}
                />
                <Nav groups={[{ links: navLinks }]} />
            </div>
        </div>
    );
};
