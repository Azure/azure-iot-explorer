/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useHistory } from 'react-router-dom';
import { Icon, Announced, Link } from '@fluentui/react';
import { Notification, NotificationType } from '../../api/models/notification';
import { ROUTE_PARAMS, ROUTE_PARTS } from '../../constants/routes';
import '../../css/_notification.scss';

export interface NotificationListEntryProps {
    notification: Notification;
    showAnnoucement: boolean;
}

export const NotificationListEntry: React.SFC<NotificationListEntryProps> = (props: NotificationListEntryProps) => {
    const { t } = useTranslation();
    const { notification } = props;
    const { pathname } = useLocation();
    const history = useHistory();

    const iconName = getIconName(notification.type);
    const iconColor = getIconColor(notification.type);
    const message = t(notification.text.translationKey, notification.text.translationOptions);
    const friendlyMessage = <>{message.split('. ').map((m: React.ReactNode, index: number) => (<div className="message" key={index}>{m + '.'}<br/></div>))}</>;
    const longMessageLength = 300;

    const navigateToNotificationCenter = () => {
        const path = `/${ROUTE_PARTS.HOME}/${ROUTE_PARTS.NOTIFICATIONS}?${ROUTE_PARAMS.NAV_FROM}`;
        history.push(path);
    };

    return (
        <div className="notification-list-entry">
            {props.showAnnoucement && <Announced message={message}/>}
            <div className={iconColor}>
                <Icon style={{fontSize: 18}} iconName={iconName} />
            </div>

            <div className="body">
                {notification.title &&
                    <div className="title">{t(notification.title.translationKey, notification.title.translationOptions)}</div>
                }
                {pathname.endsWith(ROUTE_PARTS.NOTIFICATIONS) ? friendlyMessage :
                    <>
                        {message?.length < longMessageLength ?
                            friendlyMessage :
                            <>
                                <div className="message">{`${message.substring(0, longMessageLength)}...`}</div>
                                <Link onClick={navigateToNotificationCenter}>{'Go to notification center'}</Link>
                            </>
                        }
                    </>
                }
                <div className="time">{notification.issued}</div>
            </div>
        </div>
    );
};

export const getIconName = (notificationType: NotificationType) => {
    switch (notificationType) {
        case NotificationType.error: return 'ErrorBadge';
        case NotificationType.success: return 'Completed';
        case NotificationType.warning: return 'Warning';
        default: return 'Info';
    }
};

export const getIconColor = (notificationType: NotificationType) => {
    switch (notificationType) {
        case NotificationType.error: return 'error';
        case NotificationType.success: return 'success';
        case NotificationType.warning: return 'warning';
        default: return 'info';
    }
};
