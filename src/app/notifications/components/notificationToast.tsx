/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { IconButton } from 'office-ui-fabric-react/lib/components/Button';
import { toast, ToastType, ToastOptions, UpdateOptions } from 'react-toastify';
import { useLocalizationContext } from '../../shared/contexts/localizationContext';
import { NotificationListEntry } from '../../notifications/components/notificationListEntry';
import { Notification } from '../../api/models/notification';
import { ResourceKeys } from '../../../localization/resourceKeys';
import { CANCEL } from '../../constants/iconNames';
import { useGlobalStateContext } from '../../shared/contexts/globalStateContext';
import { addNotificationAction } from '../../shared/global/actions';
import '../../css/_notification.scss';

export interface CloseButtonProps {
    // tslint:disable-next-line:no-any
    closeToast?: any;
}

export const CloseButton = (props: CloseButtonProps): JSX.Element => {
    const { t } = useLocalizationContext();
    return (
        <IconButton
            iconProps={{
                iconName: CANCEL
            }}
            label={t(ResourceKeys.common.close)}
            ariaLabel={t(ResourceKeys.common.close)}
            style={{width: 50}}
            onClick={props.closeToast}
        />
    );
};

const NotificationEntry = (props: { notification: Notification }): JSX.Element => {
    const { dispatch } = useGlobalStateContext();

    React.useEffect(() => {
        dispatch!(addNotificationAction(props.notification));
    },              []);

    return <NotificationListEntry notification={props.notification} showAnnoucement={true}/>;
};

export const raiseNotificationToast = (notification: Notification) => {
    const component = <NotificationEntry notification={notification}/>;
    const options: ToastOptions = {
        bodyClassName: 'notification-toast-body',
        closeButton: <CloseButton />,
        position: toast.POSITION.TOP_RIGHT,
        progressClassName: `notification-toast-progress-bar`,
        toastId: notification.id,
        type: ToastType.DEFAULT
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
