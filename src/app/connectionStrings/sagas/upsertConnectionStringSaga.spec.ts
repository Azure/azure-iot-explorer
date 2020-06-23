/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { call, put } from 'redux-saga/effects';
// tslint:disable-next-line: no-implicit-dependencies
import { cloneableGenerator } from '@redux-saga/testing-utils';
import { upsertConnectionStringAction } from '../actions';
import { upsertConnectionStringSaga } from './upsertConnectionStringSaga';
import { getConnectionStrings, setConnectionStrings } from './setConnectionStringsSaga';
import { CONNECTION_STRING_LIST_MAX_LENGTH } from '../../constants/browserStorage';

describe('upsertConnectionStringSaga', () => {
    describe('adding unlisted connection string', () => {
        const upsertConnectionStringSagaGenerator = cloneableGenerator(upsertConnectionStringSaga)(upsertConnectionStringAction.started({ newConnectionString: 'connectionString2'}));
        it('returns call effect to get connection strings', () => {
            expect(upsertConnectionStringSagaGenerator.next()).toEqual({
                done: false,
                value: call(getConnectionStrings)
            });
        });

        it('returns call effect to set connection strings', () => {
            expect(upsertConnectionStringSagaGenerator.next('connectionString1')).toEqual({
                done: false,
                value: call(setConnectionStrings, 'connectionString2,connectionString1')
            });
        });

        it('returns call effect to get connection strings', () => {
            expect(upsertConnectionStringSagaGenerator.next()).toEqual({
                done: false,
                value: call(getConnectionStrings)
            });
        });

        it('puts the done action', () => {
            expect(upsertConnectionStringSagaGenerator.next('connectionString2,connectionString1')).toEqual({
                done: false,
                value: put(upsertConnectionStringAction.done({params: {newConnectionString: 'connectionString2'}, result: ['connectionString2', 'connectionString1']}))
            });

            expect(upsertConnectionStringSagaGenerator.next().done).toEqual(true);
        });
    });

    describe('overwriting listed connection string', () => {
        const upsertConnectionStringSagaGenerator = cloneableGenerator(upsertConnectionStringSaga)
            (upsertConnectionStringAction.started({ newConnectionString: 'newConnectionString1', connectionString: 'connectionString1'}));
        it('returns call effect to get connection strings', () => {
            expect(upsertConnectionStringSagaGenerator.next()).toEqual({
                done: false,
                value: call(getConnectionStrings)
            });
        });

        it('returns call effect to set connection strings', () => {
            expect(upsertConnectionStringSagaGenerator.next('connectionString1')).toEqual({
                done: false,
                value: call(setConnectionStrings, 'newConnectionString1')
            });
        });

        it('returns call effect to get connection strings', () => {
            expect(upsertConnectionStringSagaGenerator.next()).toEqual({
                done: false,
                value: call(getConnectionStrings)
            });
        });

        it('puts the done action', () => {
            expect(upsertConnectionStringSagaGenerator.next('newConnectionString1')).toEqual({
                done: false,
                value: put(upsertConnectionStringAction.done({params: { newConnectionString: 'newConnectionString1', connectionString: 'connectionString1'}, result: ['newConnectionString1']}))
            });

            expect(upsertConnectionStringSagaGenerator.next().done).toEqual(true);
        });
    });

    describe('creating new list', () => {
        const upsertConnectionStringSagaGenerator = cloneableGenerator(upsertConnectionStringSaga)(upsertConnectionStringAction.started({ newConnectionString: 'connectionString1'}));
        it('returns call effect to get connection strings', () => {
            expect(upsertConnectionStringSagaGenerator.next()).toEqual({
                done: false,
                value: call(getConnectionStrings)
            });
        });

        it('returns call effect to set connection strings', () => {
            expect(upsertConnectionStringSagaGenerator.next(undefined)).toEqual({
                done: false,
                value: call(setConnectionStrings, 'connectionString1')
            });
        });

        it('returns call effect to get connection strings', () => {
            expect(upsertConnectionStringSagaGenerator.next()).toEqual({
                done: false,
                value: call(getConnectionStrings)
            });
        });

        it('puts the done action', () => {
            expect(upsertConnectionStringSagaGenerator.next('connectionString1')).toEqual({
                done: false,
                value: put(upsertConnectionStringAction.done({params: { newConnectionString: 'connectionString1'}, result: ['connectionString1']}))
            });

            expect(upsertConnectionStringSagaGenerator.next().done).toEqual(true);
        });
    });

    describe('slice of last connection string when max length exceeded', () => {
        const connectionStrings: string[] = [];
        for (let i = CONNECTION_STRING_LIST_MAX_LENGTH; i > 0; i--) {
            connectionStrings.push(`connectionString${i}`);
        }

        const connectionStringsSerialized = connectionStrings.join(',');
        const newConnectionString = `connectionString${CONNECTION_STRING_LIST_MAX_LENGTH + 1}`;
        const upsertConnectionStringSagaGenerator = cloneableGenerator(upsertConnectionStringSaga)(upsertConnectionStringAction.started({newConnectionString}));
        const updatedConnectionStringInLocalStorage = [newConnectionString, ...connectionStrings.splice(0, CONNECTION_STRING_LIST_MAX_LENGTH - 1)].join(',');

        it('returns call effect to get connection strings', () => {
            expect(upsertConnectionStringSagaGenerator.next()).toEqual({
                done: false,
                value: call(getConnectionStrings)
            });
        });

        it('returns call effect to set connection strings', () => {
            expect(upsertConnectionStringSagaGenerator.next(connectionStringsSerialized)).toEqual({
                done: false,
                value: call(setConnectionStrings, updatedConnectionStringInLocalStorage)
            });
        });

        it('returns call effect to get connection strings', () => {
            expect(upsertConnectionStringSagaGenerator.next()).toEqual({
                done: false,
                value: call(getConnectionStrings)
            });
        });

        it('puts the done action', () => {
            expect(upsertConnectionStringSagaGenerator.next(updatedConnectionStringInLocalStorage)).toEqual({
                done: false,
                value: put(upsertConnectionStringAction.done({params: {newConnectionString}, result: updatedConnectionStringInLocalStorage.split(',')}))
            });

            expect(upsertConnectionStringSagaGenerator.next().done).toEqual(true);
        });
    });
});
