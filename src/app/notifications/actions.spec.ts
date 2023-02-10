/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { clearNotificationsAction, addNotificationAction, markAllNotificationsAsReadAction } from './actions';
import { NotificationType,Notification } from '../api/models/notification';

describe('actions', () => {
    describe('clearNotificationsAction', () => {
        it('returns NOTIFICATIONS/CLEAR action object', () => {
            expect(clearNotificationsAction.type).toEqual('NOTIFICATIONS/CLEAR');
        });
    });

    describe('markAllNotificationsAsReadAction', () => {
        it('returns NOTIFICATIONS/READ action object', () => {
            expect(markAllNotificationsAsReadAction.type).toEqual('NOTIFICATIONS/READ');
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

        it('returns NOTIFICATIONS/ADD action object', () => {
            expect(addNotificationAction(notification).type).toEqual('NOTIFICATIONS/ADD');
        });
    });
});
