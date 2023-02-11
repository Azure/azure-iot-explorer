/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { Notification } from '../../api/models/notification';
import { clearNotificationsAction, addNotificationAction, markAllNotificationsAsReadAction } from '../actions';
import { NotificationsStateInterface, getInitialNotificationsState } from '../state';
import { notificationsReducer } from '../reducer';
import { NotificationsInterface } from '../interface';

export const useNotificationState = (): [NotificationsStateInterface, NotificationsInterface] => {
    const [state, dispatch] = React.useReducer(notificationsReducer, getInitialNotificationsState());
    return [state, {
        addNotification: (item: Notification) => dispatch(addNotificationAction(item)),
        clearNotifications: () => dispatch(clearNotificationsAction),
        markAllAsRead: () => dispatch(markAllNotificationsAsReadAction)
    }];
};
