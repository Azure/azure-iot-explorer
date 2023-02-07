/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { format } from 'date-fns';
import { reducerWithInitialState } from 'typescript-fsa-reducers';
import { clearNotificationsAction, markAllNotificationsAsReadAction, addNotificationAction } from './actions';
import { NotificationsStateInterface, getInitialNotificationsState } from './state';
import { Notification } from '../api/models/notification';

export const notificationsReducer = reducerWithInitialState<NotificationsStateInterface>(getInitialNotificationsState())
    .case(clearNotificationsAction, (state: NotificationsStateInterface) => {
        return {
            ...state,
            hasNew: false,
            notifications: []
        };
    })
    .case(markAllNotificationsAsReadAction, (state: NotificationsStateInterface) => {
        return {
            ...state,
            hasNew: false
        };
    })
    .case(addNotificationAction, (state: NotificationsStateInterface, payload: Notification) => {
        const existingNotifications: Notification[] = state.notifications;
        let notifications: Notification[] = [];
        let existingId: boolean = false;

        if (!payload.issued) {
            payload.issued = format(new Date(), 'h:mm:ss a');
        }

        if (payload.id) {
            notifications = existingNotifications.map(notification => {
                if (notification.id && notification.id === payload.id) {
                    existingId = true;
                    return payload;
                }

                return notification;
            });
        }

        if (!existingId) {
            notifications = [payload, ...existingNotifications];
        }

        return {
            ...state,
            hasNew: true,
            notifications
        };
    });
