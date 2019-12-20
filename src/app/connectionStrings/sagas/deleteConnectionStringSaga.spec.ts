/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { call } from 'redux-saga/effects';
import { cloneableGenerator } from 'redux-saga/utils';
import { deleteConnectionStringAction } from '../actions';
import { deleteConnectionStringSaga } from './deleteConnectionStringSaga';
import { getConnectionStrings, setConnectionStrings } from './addConnectionStringSaga';

describe('deleteConnectionStringSaga', () => {
    describe('removing unlisted connection string', () => {
        const deleteConnectionStringSagaGenerator = cloneableGenerator(deleteConnectionStringSaga)(deleteConnectionStringAction('connectionString2'));
        it('returns call effect to get connection strings', () => {
            expect(deleteConnectionStringSagaGenerator.next()).toEqual({
                done: false,
                value: call(getConnectionStrings)
            });
        });

        it('returns call effect to set connection strings', () => {
            expect(deleteConnectionStringSagaGenerator.next('connectionString1')).toEqual({
                done: false,
                value: call(setConnectionStrings, 'connectionString1')
            });
        });

        it('finishes', () => {
            expect(deleteConnectionStringSagaGenerator.next()).toEqual({
                done: true,
            });
        });
    });

    describe('removing listed connection string', () => {
        const addConnectionStringSagaGenerator = cloneableGenerator(deleteConnectionStringSaga)(deleteConnectionStringAction('connectionString1'));
        it('returns call effect to get connection strings', () => {
            expect(addConnectionStringSagaGenerator.next()).toEqual({
                done: false,
                value: call(getConnectionStrings)
            });
        });

        it('returns call effect to set connection strings', () => {
            expect(addConnectionStringSagaGenerator.next('connectionString1')).toEqual({
                done: false,
                value: call(setConnectionStrings, '')
            });
        });

        it('finishes', () => {
            expect(addConnectionStringSagaGenerator.next()).toEqual({
                done: true,
            });
        });
    });

    describe('performing no set action when no value retrieved', () => {
        const addConnectionStringSagaGenerator = cloneableGenerator(deleteConnectionStringSaga)(deleteConnectionStringAction('connectionString1'));
        it('returns call effect to get connection strings', () => {
            expect(addConnectionStringSagaGenerator.next()).toEqual({
                done: false,
                value: call(getConnectionStrings)
            });
        });

        it('finishes', () => {
            expect(addConnectionStringSagaGenerator.next()).toEqual({
                done: true,
            });
        });
    });
});
