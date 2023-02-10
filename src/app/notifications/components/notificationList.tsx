/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory, useLocation } from 'react-router-dom';
import { CommandBar, ICommandBarItemProps } from '@fluentui/react';
import { ResourceKeys } from '../../../localization/resourceKeys';
import { NotificationListEntry } from './notificationListEntry';
import { useBreadcrumbEntry } from '../../navigation/hooks/useBreadcrumbEntry';
import { ROUTE_PARAMS } from '../../constants/routes';
import { CANCEL, NAVIGATE_BACK } from '../../constants/iconNames';
import { AppInsightsClient } from '../../shared/appTelemetry/appInsightsClient';
import { TELEMETRY_PAGE_NAMES } from '../../constants/telemetry';
import { useNotificationsContext } from '../context/notificationsStateContext';
import '../../css/_notification.scss';

export const NotificationList: React.FC = () => {
    const { t } = useTranslation();
    const history = useHistory();
    const { search } = useLocation();
    const params = new URLSearchParams(search);
    const navigationBackAvailable = params.has(ROUTE_PARAMS.NAV_FROM);

    const [ {notifications}, {clearNotifications} ] = useNotificationsContext();
    useBreadcrumbEntry({name:  t(ResourceKeys.breadcrumb.notificationCenter)});

    const getCommandBarItems = (): ICommandBarItemProps[] => {
        const items = [
            {
                ariaLabel: t(ResourceKeys.modelRepository.commands.back.ariaLabel),
                disabled: notifications.length === 0,
                iconProps: { iconName: CANCEL},
                key: 'back',
                onClick: clearNotifications,
                text: t(ResourceKeys.header.notifications.dismiss)
            }
        ];

        if (navigationBackAvailable) {
            items.push(
                {
                    ariaLabel: t(ResourceKeys.modelRepository.commands.back.ariaLabel),
                    disabled: false,
                    iconProps: { iconName: NAVIGATE_BACK},
                    key: 'back',
                    onClick: history.goBack,
                    text: t(ResourceKeys.modelRepository.commands.back.label)
                }
            );
        }

        return items;
    };

    React.useEffect(() => {
        AppInsightsClient.getInstance()?.trackPageView({name: TELEMETRY_PAGE_NAMES.NOTIFICATION_LIST});
    }, []); // tslint:disable-line: align

    return (
        <>
            <CommandBar
                items={getCommandBarItems()}
            />
            <div>
                {notifications.length === 0 &&
                    <div className="notification-list-entry">{t(ResourceKeys.header.notifications.panel.noNotifications)}</div>
                }
                {notifications.map((notification, index) => {
                    return (
                        <div key={index}>
                            <NotificationListEntry notification={notification} showAnnouncement={false} />
                        </div>);
                    })
                }
            </div>
        </>
    );
};
