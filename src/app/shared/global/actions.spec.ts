/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { setRepositoryLocationsAction, clearNotificationsAction, addNotificationAction } from './actions';
import { NotificationType } from '../../api/models/notification';

describe('setSettingsRepositoryLocationsAction', () => {
    it('returns MODEL_REPOSITORY/SET action object', () => {
        expect(setRepositoryLocationsAction([])).toEqual({
            payload: [],
            type: 'MODEL_REPOSITORY/SET'
        });
    });
});

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

    it('returns NOTIFICATIONS/ADD action object', () => {
        expect(addNotificationAction(notification).type).toEqual('NOTIFICATIONS/ADD');
    });
});
