/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import reducer from './reducer';
import { clearNotificationsAction, addNotificationAction } from './actions';
import { Notification, NotificationType } from '../api/models/notification';

const notification1: Notification = {
    id: 100,
    issued: '',
    text: {
        translationKey: 'key'
    },
    title: {
        translationKey: 'key'
    },
    type: NotificationType.error
};

const notification2: Notification = {
    issued: '',
    text: {
        translationKey: 'key'
    },
    title: {
        translationKey: 'key'
    },
    type: NotificationType.error
};

const notification3: Notification = {
    id: 100,
    issued: '',
    text: {
        translationKey: 'key'
    },
    title: {
        translationKey: 'key'
    },
    type: NotificationType.error
};

const notification4: Notification = {
    id: 101,
    issued: '',
    text: {
        translationKey: 'key'
    },
    title: {
        translationKey: 'key'
    },
    type: NotificationType.error
};

describe('notifications/reducer', () => {
    describe('clearNotifications cases', () => {
        it('returns empty notifications array', () => {
            const initialState = {
                notifications: [notification1, notification2]
            };

            const action = clearNotificationsAction();
            expect(reducer(initialState, action).notifications.length).toEqual(0);
            expect(true).toEqual(true);
        });
    });

    describe('addNotification.done cases', () => {
        it('returns notification array with length 1 when empty array', () => {
            const initialState = {
                notifications: []
            };

            const action = addNotificationAction(notification2);
            const result = reducer(initialState, action);
            const expectedLength: number = 1;
            expect(result.notifications.length).toEqual(expectedLength);
            expect(result.notifications[0]).toEqual(notification2);
        });

        it('returns notification array with notification at index 0', () => {
            const initialState = {
                notifications: [notification1]
            };

            const action = addNotificationAction(notification2);
            const result = reducer(initialState, action);
            const expectedLength: number = 2;
            expect(result.notifications.length).toEqual(expectedLength);
            expect(result.notifications[0]).toEqual(notification2);
        });

        it('replaces notification when updated', () => {
            const initialState = {
                notifications: [notification1]
            };

            const action = addNotificationAction(notification3);
            const result = reducer(initialState, action);
            const expectedLength: number = 1;
            expect(result.notifications.length).toEqual(expectedLength);
            expect(result.notifications[0]).toEqual(notification3);
        });

        it('adds notification when new id added', () => {
            const initialState = {
                notifications: [notification1]
            };

            const action = addNotificationAction(notification4);
            const result = reducer(initialState, action);
            const expectedLength: number = 2;
            expect(result.notifications.length).toEqual(expectedLength);
            expect(result.notifications[0]).toEqual(notification4);
        });
    });
});
