/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { Icon } from 'office-ui-fabric-react/lib/components/Icon';
import { Announced } from 'office-ui-fabric-react/lib/components/Announced';
import { Notification, NotificationType } from '../../api/models/notification';
import '../../css/_notification.scss';

export interface NotificationListEntryProps {
    notification: Notification;
    showAnnoucement: boolean;
}

export const NotificationListEntry: React.SFC<NotificationListEntryProps> = (props: NotificationListEntryProps) => {
    const { t } = useTranslation();
    const { notification } = props;
    const iconName = getIconName(notification.type);
    const iconColor = getIconColor(notification.type);

    return (
        <div className="notification-list-entry">
            {props.showAnnoucement && <Announced message={t(notification.text.translationKey, notification.text.translationOptions)}/>}
            <div className={iconColor}>
                <Icon style={{fontSize: 18}} iconName={iconName} />
            </div>

            <div className="body">
                {notification.title &&
                    <div className="title">{t(notification.title.translationKey, notification.title.translationOptions)}</div>
                }

                <div className="message">{t(notification.text.translationKey, notification.text.translationOptions)}</div>
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
