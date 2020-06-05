/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { Record } from 'immutable';
import { globalReducer } from './reducer';
import { globalStateInitial, GlobalStateInterface } from './state';
import { REPOSITORY_LOCATION_TYPE } from '../../constants/repositoryLocationTypes';
import { clearNotificationsAction, addNotificationAction, setRepositoryLocationsAction } from './actions';
import { Notification, NotificationType } from '../../api/models/notification';

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

describe('globalReducer', () => {
    it (`handles MODEL_REPOSITORY/SET action`, () => {
        const payLoad = [
            {
                repositoryLocationType: REPOSITORY_LOCATION_TYPE.Public
            },
            {
                repositoryLocationType: REPOSITORY_LOCATION_TYPE.Local,
                value: 'folder'
            }
        ];
        const action = setRepositoryLocationsAction(payLoad);
        expect(globalReducer(globalStateInitial(), action).modelRepositoryState.repositoryLocations).toEqual([
            REPOSITORY_LOCATION_TYPE.Public,
            REPOSITORY_LOCATION_TYPE.Local
        ]);
    });

    context('clearNotifications cases', () => {
        it('returns empty notifications array', () => {
            const initialState = Record<GlobalStateInterface>({
                ...globalStateInitial(),
                notificationsState: {
                    hasNew: true,
                    notifications: [notification1, notification2]
                }
            })();

            const action = clearNotificationsAction();
            const updatedState = globalReducer(initialState, action).notificationsState;
            expect(updatedState.notifications.length).toEqual(0);
            expect(updatedState.hasNew).toEqual(false);
        });
    });

    context('addNotification.done cases', () => {
        it('returns notification array with length 1 when empty array', () => {
            const initialState = Record<GlobalStateInterface>({
                ...globalStateInitial(),
                notificationsState: {
                    hasNew: false,
                    notifications: []
                }
            })();

            const action = addNotificationAction(notification2);
            const result = globalReducer(initialState, action).notificationsState;
            const expectedLength: number = 1;
            expect(result.notifications.length).toEqual(expectedLength);
            expect(result.notifications[0]).toEqual(notification2);
        });

        it('returns notification array with notification at index 0', () => {
            const initialState = Record<GlobalStateInterface>({
                ...globalStateInitial(),
                notificationsState: {
                    hasNew: true,
                    notifications: [notification1]
                }
            })();

            const action = addNotificationAction(notification2);
            const result = globalReducer(initialState, action).notificationsState;
            const expectedLength: number = 2;
            expect(result.notifications.length).toEqual(expectedLength);
            expect(result.notifications[0]).toEqual(notification2);
        });

        it('replaces notification when updated', () => {
            const initialState = Record<GlobalStateInterface>({
                ...globalStateInitial(),
                notificationsState: {
                    hasNew: false,
                    notifications: [notification3]
                }
            })();

            const action = addNotificationAction(notification3);
            const result = globalReducer(initialState, action).notificationsState;
            const expectedLength: number = 1;
            expect(result.notifications.length).toEqual(expectedLength);
            expect(result.notifications[0]).toEqual(notification3);
        });

        it('adds notification when new id added', () => {
            const initialState = Record<GlobalStateInterface>({
                ...globalStateInitial(),
                notificationsState: {
                    hasNew: false,
                    notifications: [notification1]
                }
            })();

            const action = addNotificationAction(notification4);
            const result = globalReducer(initialState, action).notificationsState;
            const expectedLength: number = 2;
            expect(result.notifications.length).toEqual(expectedLength);
            expect(result.notifications[0]).toEqual(notification4);
        });
    });
 });
