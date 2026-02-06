/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { call, put } from 'redux-saga/effects';
// tslint:disable-next-line: no-implicit-dependencies
import { cloneableGenerator } from '@redux-saga/testing-utils';
import { getConnectionStringsAction } from '../actions';
import { getConnectionStrings, getConnectionStringsSaga } from './getConnectionStringsSaga';
import { raiseNotificationToast } from '../../notifications/components/notificationToast';
import { ResourceKeys } from '../../../localization/resourceKeys';
import { NotificationType } from '../../api/models/notification';
import { setConnectionStrings } from './setConnectionStringsSaga';
import { getConnectionStrings as getStoredConnectionStrings, deleteConnectionStrings } from '../../shared/utils/credentialStorage';

describe('getConnectionStringsSaga', () => {
    const getConnectionStringsSagaGenerator = cloneableGenerator(getConnectionStringsSaga)();
    it('returns call effect to get connection strings', () => {
        expect(getConnectionStringsSagaGenerator.next()).toEqual({
            done: false,
            value: call(getConnectionStrings)
        });
    });

    it('puts the done action', () => {
        const stringsWithExpiry = [{
            connectionString: 'connectionString1',
            expiration: (new Date()).toUTCString()
        }];
        expect(getConnectionStringsSagaGenerator.next(stringsWithExpiry)).toEqual({
            done: false,
            value: put(getConnectionStringsAction.done({result: stringsWithExpiry}))
        });

        expect(getConnectionStringsSagaGenerator.next().done).toEqual(true);
    });
});

describe('getConnectionString', () => {
    it('notifies users and removed strings with no expiry', () => {
        const getConnectionStringsGenerator = cloneableGenerator(getConnectionStrings)();
        // First call is to getStoredConnectionStrings
        expect(getConnectionStringsGenerator.next()).toEqual({
            done: false,
            value: call(getStoredConnectionStrings)
        });
        // Simulate invalid data returned (parse will fail)
        expect(getConnectionStringsGenerator.next([{invalidProp: 'hellowWorld'}])).toEqual({
            done: false,
            value: call(raiseNotificationToast, {
                text: {
                    translationKey: ResourceKeys.notifications.connectionStringsWithExpiryRemovalWarning
                },
                type: NotificationType.warning
            })
        });
    });

    it('notifies users and removed strings expired', () => {
        const getConnectionStringsGenerator = cloneableGenerator(getConnectionStrings)();
        const stringsWithExpiry = [{
            connectionString: 'connectionString1',
            expiration: (new Date(0)).toUTCString()
        }];
        // First call is to getStoredConnectionStrings
        expect(getConnectionStringsGenerator.next()).toEqual({
            done: false,
            value: call(getStoredConnectionStrings)
        });
        // Return expired strings
        expect(getConnectionStringsGenerator.next(stringsWithExpiry)).toEqual({
            done: false,
            value: call(raiseNotificationToast, {
                text: {
                    translationKey: ResourceKeys.notifications.connectionStringsWithExpiryRemovalWarning
                },
                type: NotificationType.warning
            })
        });

        expect(getConnectionStringsGenerator.next()).toEqual({
            done: false,
            value: call(setConnectionStrings, [])
        });
    });

    it('returns empty array when no credentials stored', () => {
        const getConnectionStringsGenerator = cloneableGenerator(getConnectionStrings)();
        // First call is to getStoredConnectionStrings
        expect(getConnectionStringsGenerator.next()).toEqual({
            done: false,
            value: call(getStoredConnectionStrings)
        });
        // Return empty array
        expect(getConnectionStringsGenerator.next([])).toEqual({
            done: true,
            value: []
        });
    });
});
