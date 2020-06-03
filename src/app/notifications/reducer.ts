/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { reducerWithInitialState } from 'typescript-fsa-reducers';
import { notificationsStateInterfaceInitial, NotificationsStateInterface } from './state';
import { clearNotificationsAction, addNotificationAction, markAllNotificationsAsReadAction  } from './actions';
import { Notification } from '../api/models/notification';

const reducer = reducerWithInitialState<NotificationsStateInterface>(notificationsStateInterfaceInitial)
    .case(clearNotificationsAction, (state: NotificationsStateInterface) => {
        return {
            hasNew: false,
            notifications: []
        };
    })
    .case(markAllNotificationsAsReadAction, (state: NotificationsStateInterface) => {
       return {
           hasNew: false,
           notifications: state.notifications
       };
    })
    .case(addNotificationAction, (state: NotificationsStateInterface, payload: Notification) => {
        let notifications: Notification[];
        let existingId: boolean = false;

        if (!payload.issued) {
            payload.issued =  Date();
        }

        if (payload.id) {
            notifications = state.notifications.map(notification => {
                if (notification.id && notification.id === payload.id) {
                    existingId = true;
                    return payload;
                }

                return notification;
            });
        }

        if (!existingId) {
            notifications = [payload, ...state.notifications];
        }

        return {
            hasNew: true,
            notifications
        };
    });

export default reducer;
