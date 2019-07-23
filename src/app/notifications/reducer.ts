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
    .case(addNotificationAction.done, (state: NotificationsStateInterface, payload: { params: Notification, result: Notification }) => {
        let notifications: Notification[];
        let existingId: boolean = false;

        if (payload.result.id) {
            notifications = state.notifications.map(notification => {
                if (notification.id && notification.id === payload.result.id) {
                    existingId = true;
                    return payload.result;
                }

                return notification;
            });
        }

        if (!existingId) {
            notifications = [payload.result, ...state.notifications];
        }

        return {
            hasNew: true,
            notifications
        };
    });

export default reducer;
