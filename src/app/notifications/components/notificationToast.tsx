/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@fluentui/react-components';
import { DismissRegular } from '@fluentui/react-icons';
import { toast, ToastOptions, UpdateOptions } from 'react-toastify';
import { NotificationListEntry } from '../../notifications/components/notificationListEntry';
import { Notification } from '../../api/models/notification';
import { ResourceKeys } from '../../../localization/resourceKeys';
import { useNotificationsContext } from '../context/notificationsStateContext';
import '../../css/_notification.scss';

export interface CloseButtonProps {
    // tslint:disable-next-line:no-any
    closeToast?: any;
}

export const CloseButton = (props: CloseButtonProps): React.JSX.Element => {
    const { t } = useTranslation();
    return (
        <Button
            appearance="subtle"
            icon={<DismissRegular />}
            aria-label={t(ResourceKeys.common.close)}
            style={{width: 50}}
            onClick={props.closeToast}
        />
    );
};

const NotificationEntry = (props: { notification: Notification }): React.JSX.Element => {
    const [ , {addNotification}] = useNotificationsContext();

    React.useEffect(() => {
        addNotification(props.notification);
    },              [props.notification]); // eslint-disable-line react-hooks/exhaustive-deps -- addNotification is stable

    return <NotificationListEntry notification={props.notification} showAnnouncement={true}/>;
};

export const raiseNotificationToast = (notification: Notification) => {
    const component = <NotificationEntry notification={notification}/>;
    const options: ToastOptions = {
        className: 'notification-toast-body',
        closeButton: <CloseButton />,
        position: 'top-right',
        progressClassName: `notification-toast-progress-bar`,
        toastId: notification.id,
        type: 'default'
    };

    if (notification.id && toast.isActive(notification.id)) {
        const updateOptions = options as UpdateOptions;
        updateOptions.render = component;
        toast.update(notification.id, options);
    }
    else {
        toast(component, options);
    }
};
