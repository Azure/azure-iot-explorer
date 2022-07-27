/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { Nav, INavLink } from '@fluentui/react';
import { ROUTE_PARTS } from '../../constants/routes';
import { ResourceKeys } from '../../../localization/resourceKeys';
import '../../css/_layouts.scss';
import './homeViewNavigation.scss';

export const HomeViewNavigation: React.FC = () => {
    const { t } = useTranslation();

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
            <div>
                <Nav groups={[{ links: navLinks }]} />
            </div>
        </div>
    );
};
