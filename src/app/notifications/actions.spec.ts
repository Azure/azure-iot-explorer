/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { clearNotificationsAction, addNotificationAction } from './actions';
import { Notification, NotificationType } from '../api/models/notification';

describe('clearNotificationsAction', () => {
    it('returns NOTIFICATIONS/CLEAR action object', () => {
        expect(clearNotificationsAction.type).toEqual('NOTIFICATIONS/CLEAR');
    });
});

describe ('addNotificationAction', () => {
    const notification: Notification = {
        issued: Date(),
        text: {
            translationKey: 'key'
        },
        title: {
            translationKey: 'key'
        },
        type: NotificationType.error
    };

    it('returns NOTIFICATIONS/ADD_STARTED action object', () => {
        expect(addNotificationAction.started(notification).type).toEqual('NOTIFICATIONS/ADD_STARTED');
    });

    it('returns NOTIFICATIONS/ADD_DONE action object', () => {
        expect(addNotificationAction.done({ params: notification, result: notification}).type).toEqual('NOTIFICATIONS/ADD_DONE');
    });

    it('returns NOTIFICATIONS/ADD_FAILED action object', () => {
        expect(addNotificationAction.failed({ params: notification, error: undefined}).type).toEqual('NOTIFICATIONS/ADD_FAILED');
    });
});
