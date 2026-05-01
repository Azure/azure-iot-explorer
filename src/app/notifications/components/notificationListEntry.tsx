/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button, Link } from '@fluentui/react-components';
import { CopyRegular, ErrorCircleRegular, CheckmarkCircleRegular, WarningRegular, InfoRegular, AlertRegular } from '@fluentui/react-icons';
import { Notification, NotificationType } from '../../api/models/notification';
import { ROUTE_PARAMS, ROUTE_PARTS } from '../../constants/routes';
import { ResourceKeys } from '../../../localization/resourceKeys';
import '../../css/_notification.scss';
import { LiveRegion } from '../../shared/components/liveRegion';

export interface NotificationListEntryProps {
    notification: Notification;
    showAnnouncement: boolean;
}

export const NotificationListEntry: React.FC<NotificationListEntryProps> = (props: NotificationListEntryProps) => {
    const { t } = useTranslation();
    const { notification } = props;
    const { pathname } = useLocation();
    const navigate = useNavigate();

    const NotificationIcon = getNotificationIcon(notification.type);
    const iconColor = getIconColor(notification.type);
    const message = t(notification.text.translationKey, notification.text.translationOptions);
    const friendlyMessage = <>{message.split('. ').map((m: React.ReactNode, index: number) => (<div className="message" key={index}>{m + '.'}<br/></div>))}</>;
    const longMessageLength = 300;

    const navigateToNotificationCenter = () => {
        const path = `/${ROUTE_PARTS.HOME}/${ROUTE_PARTS.NOTIFICATIONS}?${ROUTE_PARAMS.NAV_FROM}`;
        navigate(path);
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(message);
    };

    const CopyButton = (buttonProps: { isFlex: boolean }): JSX.Element => {
        return (
            <Button
                appearance="subtle"
                icon={<CopyRegular />}
                title={t(ResourceKeys.header.notifications.copy)}
                aria-label={t(ResourceKeys.header.notifications.copy)}
                onClick={copyToClipboard}
                style={buttonProps.isFlex ? {flex: '1'} : {}}
            />
        );
    };

    return (
        <div className="notification-list-entry">
            {props.showAnnouncement && <LiveRegion message={message}/>}
            <div className={iconColor}>
                <NotificationIcon style={{fontSize: 18}} />
            </div>

            <div className="body">
                {notification.title &&
                    <div className="title">{t(notification.title.translationKey, notification.title.translationOptions)}</div>
                }
                {pathname.endsWith(ROUTE_PARTS.NOTIFICATIONS) ?
                    <>
                        {friendlyMessage}
                        <div className="notificationEntry-flexContainer">
                            <div className="time alignCenter">{notification.issued}</div>
                            <CopyButton isFlex={false}/>
                        </div>
                    </> :
                    <>
                        {message?.length < longMessageLength ?
                            friendlyMessage :
                            <>
                                <div className="message">{`${message.substring(0, longMessageLength)}...`}</div>
                            </>
                        }
                        <div className="notificationEntry-flexContainer">
                            <Link onClick={navigateToNotificationCenter} style={{flex: '5'}}>
                                <AlertRegular className="notificationEntry-Ringer" />
                                {t(ResourceKeys.header.notifications.title)}
                            </Link>
                            <CopyButton isFlex={true}/>
                        </div>
                        <div className="time">{notification.issued}</div>
                    </>
                }
            </div>
        </div>
    );
};

export const getNotificationIcon = (notificationType: NotificationType) => {
    switch (notificationType) {
        case NotificationType.error: return ErrorCircleRegular;
        case NotificationType.success: return CheckmarkCircleRegular;
        case NotificationType.warning: return WarningRegular;
        default: return InfoRegular;
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
