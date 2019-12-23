/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { call } from 'redux-saga/effects';
import { cloneableGenerator } from 'redux-saga/utils';
import { addConnectionStringAction } from '../actions';
import { addConnectionStringSaga, getConnectionStrings, setConnectionStrings } from './addConnectionStringSaga';
import { CONNECTION_STRING_LIST_MAX_LENGTH, CONNECTION_STRING_NAME_LIST } from '../../constants/browserStorage';

describe('getConnectionString', () => {
    it('returns expected value', () => {
        const setValue = 'helloworld';
        localStorage.setItem(CONNECTION_STRING_NAME_LIST, setValue);
        expect(getConnectionStrings()).toEqual(setValue);
    });
});

describe('setConnectionString', () => {
    it('sets expected value', () => {
        const setValue = 'cruelworld';
        setConnectionStrings(setValue);

        expect(localStorage.getItem(CONNECTION_STRING_NAME_LIST)).toEqual(setValue);
    });
});

describe('addConnectionStringSaga', () => {
    describe('adding unlisted connection string', () => {
        const addConnectionStringSagaGenerator = cloneableGenerator(addConnectionStringSaga)(addConnectionStringAction('connectionString2'));
        it('returns call effect to get connection strings', () => {
            expect(addConnectionStringSagaGenerator.next()).toEqual({
                done: false,
                value: call(getConnectionStrings)
            });
        });

        it('returns call effect to set connection strings', () => {
            expect(addConnectionStringSagaGenerator.next('connectionString1')).toEqual({
                done: false,
                value: call(setConnectionStrings, 'connectionString2,connectionString1')
            });
        });

        it('finishes', () => {
            expect(addConnectionStringSagaGenerator.next()).toEqual({
                done: true,
            });
        });
    });

    describe('adding listed connection string', () => {
        const addConnectionStringSagaGenerator = cloneableGenerator(addConnectionStringSaga)(addConnectionStringAction('connectionString1'));
        it('returns call effect to get connection strings', () => {
            expect(addConnectionStringSagaGenerator.next()).toEqual({
                done: false,
                value: call(getConnectionStrings)
            });
        });

        it('returns call effect to set connection strings', () => {
            expect(addConnectionStringSagaGenerator.next('connectionString1')).toEqual({
                done: false,
                value: call(setConnectionStrings, 'connectionString1')
            });
        });

        it('finishes', () => {
            expect(addConnectionStringSagaGenerator.next()).toEqual({
                done: true,
            });
        });
    });

    describe('creating new list', () => {
        const addConnectionStringSagaGenerator = cloneableGenerator(addConnectionStringSaga)(addConnectionStringAction('connectionString1'));
        it('returns call effect to get connection strings', () => {
            expect(addConnectionStringSagaGenerator.next()).toEqual({
                done: false,
                value: call(getConnectionStrings)
            });
        });

        it('returns call effect to set connection strings', () => {
            expect(addConnectionStringSagaGenerator.next(undefined)).toEqual({
                done: false,
                value: call(setConnectionStrings, 'connectionString1')
            });
        });

        it('finishes', () => {
            expect(addConnectionStringSagaGenerator.next()).toEqual({
                done: true,
            });
        });
    });

    describe('slice of last connection string when max length exceeded', () => {
        const connectionStrings: string[] = [];
        for (let i = CONNECTION_STRING_LIST_MAX_LENGTH; i > 0; i--) {
            connectionStrings.push(`connectionString${i}`);
        }

        const connectionStringsSerialized = connectionStrings.join(',');
        const newConnectionString = `connectionString${CONNECTION_STRING_LIST_MAX_LENGTH + 1}`;
        const addConnectionStringSagaGenerator = cloneableGenerator(addConnectionStringSaga)(addConnectionStringAction(newConnectionString));

        it('returns call effect to get connection strings', () => {
            expect(addConnectionStringSagaGenerator.next()).toEqual({
                done: false,
                value: call(getConnectionStrings)
            });
        });

        it('returns call effect to set connection strings', () => {
            expect(addConnectionStringSagaGenerator.next(connectionStringsSerialized)).toEqual({
                done: false,
                value: call(setConnectionStrings, [newConnectionString, ...connectionStrings.splice(0, CONNECTION_STRING_LIST_MAX_LENGTH - 1)].join(','))
            });
        });

        it('finishes', () => {
            expect(addConnectionStringSagaGenerator.next()).toEqual({
                done: true,
            });
        });

    });
});
