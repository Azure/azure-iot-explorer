/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { getInitialState } from '../api/shared/testHelper';
import { getNotificationsSelector } from './selectors';
import { Notification, NotificationType } from '../api/models/notification';

describe('getNotificationsSelector', () => {
    it('returns empty array when notifications state is undefined', () => {
        const state = getInitialState();
        state.notificationsState = undefined;
        expect(getNotificationsSelector(state).length).toEqual(0);
    });

    it('returns array when state has non-empty array', () => {
        const notification1: Notification = {
            issued: '',
            text: {
                translationKey: 'key'
            },
            title: {
                translationKey: 'key'
            },
            type: NotificationType.error
        };

        const state = getInitialState();
        state.notificationsState = {
            notifications: [notification1]
        };
        expect(getNotificationsSelector(state).length).toEqual(1);
    });
});
