/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { TabList, Tab } from '@fluentui/react-components';
import { OrganizationRegular, PlugDisconnectedRegular, AlertRegular } from '@fluentui/react-icons';
import { ROUTE_PARTS } from '../../constants/routes';
import { ResourceKeys } from '../../../localization/resourceKeys';
import { CollapsibleButton } from '../../shared/components/collapsibleButton';
import './homeViewNavigation.scss';

export interface HomeViewNavigationProps {
    appMenuVisible: boolean;
    setAppMenuVisible: (appMenuVisible: boolean) => void;
}

const navIconMap: Record<string, React.ReactElement> = {
    [ROUTE_PARTS.RESOURCES]: <OrganizationRegular />,
    [ROUTE_PARTS.MODEL_REPOS]: <PlugDisconnectedRegular />,
    [ROUTE_PARTS.NOTIFICATIONS]: <AlertRegular />,
};

export const HomeViewNavigation: React.FC<HomeViewNavigationProps> = props => {
    const { t } = useTranslation();
    const { appMenuVisible, setAppMenuVisible } = props;

    const navLinks = [
        {
            key: ROUTE_PARTS.RESOURCES,
            name: t(ResourceKeys.breadcrumb.resources),
            url: `#/${ROUTE_PARTS.HOME}/${ROUTE_PARTS.RESOURCES}`
        },
        {
            key: ROUTE_PARTS.MODEL_REPOS,
            name: t(ResourceKeys.breadcrumb.repos),
            url: `#/${ROUTE_PARTS.HOME}/${ROUTE_PARTS.MODEL_REPOS}`
        },
        {
            key: ROUTE_PARTS.NOTIFICATIONS,
            name: t(ResourceKeys.breadcrumb.notificationCenter),
            url: `#/${ROUTE_PARTS.HOME}/${ROUTE_PARTS.NOTIFICATIONS}`
        },
    ];
    return (
        <div role="navigation" className="nav-link-left">
            <CollapsibleButton
                appMenuVisible={appMenuVisible}
                setAppMenuVisible={setAppMenuVisible}
            />
            <TabList vertical appearance="subtle">
                {navLinks.map(link => (
                    <Tab
                        key={link.key}
                        value={link.key}
                        icon={navIconMap[link.key]}
                        as="a"
                        {...{ href: link.url } as any}
                    >
                        {appMenuVisible ? link.name : undefined}
                    </Tab>
                ))}
            </TabList>
        </div>
    );
};
