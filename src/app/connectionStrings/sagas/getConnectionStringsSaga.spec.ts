/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { call, put } from 'redux-saga/effects';
// tslint:disable-next-line: no-implicit-dependencies
import { cloneableGenerator } from '@redux-saga/testing-utils';
import { CONNECTION_STRING_NAME_LIST } from '../../constants/browserStorage';
import { getConnectionStringsAction } from '../actions';
import { getConnectionStrings, getConnectionStringsSaga } from './getConnectionStringsSaga';
import { raiseNotificationToast } from '../../notifications/components/notificationToast';
import { ResourceKeys } from '../../../localization/resourceKeys';
import { NotificationType } from '../../api/models/notification';
import { setConnectionStrings } from './setConnectionStringsSaga';

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
        localStorage.setItem(CONNECTION_STRING_NAME_LIST, 'hellowWorld');
        expect(getConnectionStringsGenerator.next('hellowWorld')).toEqual({
            done: false,
            value: call(raiseNotificationToast, {
                text: {
                    translationKey: ResourceKeys.notifications.connectionStringsWithoutExpiryRemovalWarning
                },
                type: NotificationType.warning
            })
        });

        getConnectionStringsGenerator.next();
        expect(localStorage.getItem(CONNECTION_STRING_NAME_LIST)).toEqual('');
    });

    it('notifies users and removed strings expired', () => {
        const getConnectionStringsGenerator = cloneableGenerator(getConnectionStrings)();
        const stringsWithExpiry = [{
            connectionString: 'connectionString1',
            expiration: (new Date(0)).toUTCString()
        }];
        localStorage.setItem(CONNECTION_STRING_NAME_LIST, JSON.stringify(stringsWithExpiry));
        expect(getConnectionStringsGenerator.next(JSON.stringify(stringsWithExpiry))).toEqual({
            done: false,
            value: call(raiseNotificationToast, {
                text: {
                    translationKey: ResourceKeys.notifications.connectionStringsWithExpiryRemovalWarning
                },
                type: NotificationType.warning
            })
        });

        expect(getConnectionStringsGenerator.next(JSON.stringify(stringsWithExpiry))).toEqual({
            done: false,
            value: call(setConnectionStrings, [])
        });
    });
});
