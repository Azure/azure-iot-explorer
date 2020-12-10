/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { call, put } from 'redux-saga/effects';
// tslint:disable-next-line: no-implicit-dependencies
import { cloneableGenerator } from '@redux-saga/testing-utils';
import { upsertConnectionStringAction } from '../actions';
import { upsertConnectionStringSaga } from './upsertConnectionStringSaga';
import { setConnectionStrings } from './setConnectionStringsSaga';
import { CONNECTION_STRING_LIST_MAX_LENGTH } from '../../constants/browserStorage';
import { getConnectionStrings } from './getConnectionStringsSaga';

describe('upsertConnectionStringSaga', () => {
    const saveStringsWithExpiry = [{
        connectionString: 'connectionString1',
        expiration: (new Date(0)).toUTCString()
    }];

    describe('adding unlisted connection string', () => {
        const stringWithExpiry = {
            connectionString: 'connectionString2',
            expiration: (new Date()).toUTCString()
        };
        const upsertConnectionStringSagaGenerator = cloneableGenerator(upsertConnectionStringSaga)(upsertConnectionStringAction.started(stringWithExpiry));
        it('returns call effect to get connection strings', () => {
            expect(upsertConnectionStringSagaGenerator.next()).toEqual({
                done: false,
                value: call(getConnectionStrings)
            });
        });

        it('returns call effect to set connection strings', () => {
            expect(upsertConnectionStringSagaGenerator.next(saveStringsWithExpiry)).toEqual({
                done: false,
                value: call(setConnectionStrings, [stringWithExpiry, ...saveStringsWithExpiry])
            });
        });

        it('returns call effect to get connection strings', () => {
            expect(upsertConnectionStringSagaGenerator.next()).toEqual({
                done: false,
                value: call(getConnectionStrings)
            });
        });

        it('puts the done action', () => {
            expect(upsertConnectionStringSagaGenerator.next([stringWithExpiry, ...saveStringsWithExpiry])).toEqual({
                done: false,
                value: put(upsertConnectionStringAction.done({params: stringWithExpiry, result: [stringWithExpiry, ...saveStringsWithExpiry]}))
            });

            expect(upsertConnectionStringSagaGenerator.next().done).toEqual(true);
        });
    });

    describe('overwriting listed connection string', () => {
        const stringWithExpiry = {
            connectionString: 'connectionString1',
            expiration: (new Date()).toUTCString()
        };
        const upsertConnectionStringSagaGenerator = cloneableGenerator(upsertConnectionStringSaga)
            (upsertConnectionStringAction.started(stringWithExpiry));
        it('returns call effect to get connection strings', () => {
            expect(upsertConnectionStringSagaGenerator.next()).toEqual({
                done: false,
                value: call(getConnectionStrings)
            });
        });

        it('returns call effect to set connection strings', () => {
            expect(upsertConnectionStringSagaGenerator.next(saveStringsWithExpiry)).toEqual({
                done: false,
                value: call(setConnectionStrings, [stringWithExpiry])
            });
        });

        it('returns call effect to get connection strings', () => {
            expect(upsertConnectionStringSagaGenerator.next()).toEqual({
                done: false,
                value: call(getConnectionStrings)
            });
        });

        it('puts the done action', () => {
            expect(upsertConnectionStringSagaGenerator.next([stringWithExpiry])).toEqual({
                done: false,
                value: put(upsertConnectionStringAction.done({params: stringWithExpiry, result: [stringWithExpiry]}))
            });

            expect(upsertConnectionStringSagaGenerator.next().done).toEqual(true);
        });
    });

    describe('creating new list', () => {
        const stringWithExpiry = {
            connectionString: 'connectionString1',
            expiration: (new Date()).toUTCString()
        };
        const upsertConnectionStringSagaGenerator = cloneableGenerator(upsertConnectionStringSaga)(upsertConnectionStringAction.started(stringWithExpiry));
        it('returns call effect to get connection strings', () => {
            expect(upsertConnectionStringSagaGenerator.next()).toEqual({
                done: false,
                value: call(getConnectionStrings)
            });
        });

        it('returns call effect to set connection strings', () => {
            expect(upsertConnectionStringSagaGenerator.next([])).toEqual({
                done: false,
                value: call(setConnectionStrings, [stringWithExpiry])
            });
        });

        it('returns call effect to get connection strings', () => {
            expect(upsertConnectionStringSagaGenerator.next()).toEqual({
                done: false,
                value: call(getConnectionStrings)
            });
        });

        it('puts the done action', () => {
            expect(upsertConnectionStringSagaGenerator.next([stringWithExpiry])).toEqual({
                done: false,
                value: put(upsertConnectionStringAction.done({params: stringWithExpiry, result: [stringWithExpiry]}))
            });

            expect(upsertConnectionStringSagaGenerator.next().done).toEqual(true);
        });
    });

    describe('slice of last connection string when max length exceeded', () => {
        const connectionStrings = [];
        for (let i = CONNECTION_STRING_LIST_MAX_LENGTH; i > 0; i--) {
            connectionStrings.push({
                connectionString: `connectionString${i}`,
                expiration: (new Date()).toUTCString()
            });
        }
        const stringWithExpiry = {
            connectionString: `connectionString${CONNECTION_STRING_LIST_MAX_LENGTH + 1}`,
            expiration: (new Date()).toUTCString()
        };

        const upsertConnectionStringSagaGenerator = cloneableGenerator(upsertConnectionStringSaga)(upsertConnectionStringAction.started(stringWithExpiry));
        const updatedConnectionString = [stringWithExpiry, ...connectionStrings].splice(0, CONNECTION_STRING_LIST_MAX_LENGTH);

        it('returns call effect to get connection strings', () => {
            expect(upsertConnectionStringSagaGenerator.next()).toEqual({
                done: false,
                value: call(getConnectionStrings)
            });
        });

        it('returns call effect to set connection strings', () => {
            expect(upsertConnectionStringSagaGenerator.next(connectionStrings)).toEqual({
                done: false,
                value: call(setConnectionStrings, updatedConnectionString)
            });
        });

        it('returns call effect to get connection strings', () => {
            expect(upsertConnectionStringSagaGenerator.next()).toEqual({
                done: false,
                value: call(getConnectionStrings)
            });
        });

        it('puts the done action', () => {
            expect(upsertConnectionStringSagaGenerator.next(updatedConnectionString)).toEqual({
                done: false,
                value: put(upsertConnectionStringAction.done({params: stringWithExpiry, result: updatedConnectionString}))
            });

            expect(upsertConnectionStringSagaGenerator.next().done).toEqual(true);
        });
    });
});
