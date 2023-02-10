/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { notificationsReducer } from './reducer';
import { getInitialNotificationsState } from './state';
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

describe('notificationsReducer', () => {
    context('clearNotifications cases', () => {
        it('returns empty notifications array', () => {
            const initialState = {
                ...getInitialNotificationsState(),
                hasNew: true,
                notifications: [notification1, notification2]
            }

            const action = clearNotificationsAction();
            const updatedState = notificationsReducer(initialState, action);
            expect(updatedState.notifications.length).toEqual(0);
            expect(updatedState.hasNew).toEqual(false);
        });
    });

    context('addNotification.done cases', () => {
        it('returns notification array with length 1 when empty array', () => {
            const initialState = {
                ...getInitialNotificationsState(),
                hasNew: false,
                notifications: []
            }

            const action = addNotificationAction(notification2);
            const result = notificationsReducer(initialState, action);
            const expectedLength: number = 1;
            expect(result.notifications.length).toEqual(expectedLength);
            expect(result.notifications[0]).toEqual(notification2);
        });

        it('returns notification array with notification at index 0', () => {
            const initialState = {
                ...getInitialNotificationsState(),
                hasNew: true,
                notifications: [notification1]
            }

            const action = addNotificationAction(notification2);
            const result = notificationsReducer(initialState, action);
            const expectedLength: number = 2;
            expect(result.notifications.length).toEqual(expectedLength);
            expect(result.notifications[0]).toEqual(notification2);
        });

        it('replaces notification when updated', () => {
            const initialState = {
                ...getInitialNotificationsState(),
                hasNew: false,
                notifications: [notification3]
            }

            const action = addNotificationAction(notification3);
            const result = notificationsReducer(initialState, action);
            const expectedLength: number = 1;
            expect(result.notifications.length).toEqual(expectedLength);
            expect(result.notifications[0]).toEqual(notification3);
        });

        it('adds notification when new id added', () => {
            const initialState = {
                ...getInitialNotificationsState(),
                hasNew: false,
                notifications: [notification1]
            }

            const action = addNotificationAction(notification4);
            const result = notificationsReducer(initialState, action);
            const expectedLength: number = 2;
            expect(result.notifications.length).toEqual(expectedLength);
            expect(result.notifications[0]).toEqual(notification4);
        });
    });
 });
