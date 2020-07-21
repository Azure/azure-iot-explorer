/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { call, put } from 'redux-saga/effects';
// tslint:disable-next-line: no-implicit-dependencies
import { cloneableGenerator } from '@redux-saga/testing-utils';
import { deleteConnectionStringAction } from '../actions';
import { deleteConnectionStringSaga } from './deleteConnectionStringSaga';
import { setConnectionStrings } from './setConnectionStringsSaga';
import { getConnectionStrings } from './getConnectionStringsSaga';

describe('deleteConnectionStringSaga', () => {
    describe('removing unlisted connection string', () => {
        const deleteConnectionStringSagaGenerator = cloneableGenerator(deleteConnectionStringSaga)(deleteConnectionStringAction.started('connectionString2'));
        it('returns call effect to get connection strings', () => {
            expect(deleteConnectionStringSagaGenerator.next()).toEqual({
                done: false,
                value: call(getConnectionStrings)
            });
        });

        it('returns call effect to set connection strings', () => {
            expect(deleteConnectionStringSagaGenerator.next(['connectionString1'])).toEqual({
                done: false,
                value: call(setConnectionStrings, 'connectionString1')
            });
        });

        it('puts the done action', () => {
            expect(deleteConnectionStringSagaGenerator.next(['connectionString1'])).toEqual({
                done: false,
                value: put(deleteConnectionStringAction.done({params: 'connectionString2', result: ['connectionString1']}))
            });

            expect(deleteConnectionStringSagaGenerator.next().done).toEqual(true);
        });
    });

    describe('removing listed connection string', () => {
        const deleteConnectionStringSagaGenerator = cloneableGenerator(deleteConnectionStringSaga)(deleteConnectionStringAction.started('connectionString1'));
        it('returns call effect to get connection strings', () => {
            expect(deleteConnectionStringSagaGenerator.next()).toEqual({
                done: false,
                value: call(getConnectionStrings)
            });
        });

        it('returns call effect to set connection strings', () => {
            expect(deleteConnectionStringSagaGenerator.next(['connectionString1'])).toEqual({
                done: false,
                value: call(setConnectionStrings, '')
            });
        });

        it('puts the done action', () => {
            expect(deleteConnectionStringSagaGenerator.next([])).toEqual({
                done: false,
                value: put(deleteConnectionStringAction.done({params: 'connectionString1', result: []}))
            });

            expect(deleteConnectionStringSagaGenerator.next().done).toEqual(true);
        });
    });

    describe('performing no set action when no value retrieved', () => {
        const deleteConnectionStringSagaGenerator = cloneableGenerator(deleteConnectionStringSaga)(deleteConnectionStringAction.started('connectionString1'));
        it('returns call effect to get connection strings', () => {
            expect(deleteConnectionStringSagaGenerator.next()).toEqual({
                done: false,
                value: call(getConnectionStrings)
            });
        });

        it('puts the done action', () => {
            expect(deleteConnectionStringSagaGenerator.next([])).toEqual({
                done: false,
                value: put(deleteConnectionStringAction.done({params: 'connectionString1', result: []}))
            });

            expect(deleteConnectionStringSagaGenerator.next().done).toEqual(true);
        });
    });
});
