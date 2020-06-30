/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { call, put } from 'redux-saga/effects';
// tslint:disable-next-line: no-implicit-dependencies
import { cloneableGenerator } from '@redux-saga/testing-utils';
import { setConnectionStringsAction } from '../actions';
import { setConnectionStringsSaga, setConnectionStrings } from './setConnectionStringsSaga';
import { CONNECTION_STRING_NAME_LIST } from '../../constants/browserStorage';

describe('setConnectionString', () => {
    it('sets expected value', () => {
        const setValue = 'cruelworld';
        setConnectionStrings(setValue);

        expect(localStorage.getItem(CONNECTION_STRING_NAME_LIST)).toEqual(setValue);
    });
});

describe('setConnectionStringsSaga', () => {
    const setConnectionStringsSagaGenerator = cloneableGenerator(setConnectionStringsSaga)(setConnectionStringsAction.started(['connectionString2']));
    it('returns call effect to set connection strings', () => {
        expect(setConnectionStringsSagaGenerator.next()).toEqual({
            done: false,
            value: call(setConnectionStrings, 'connectionString2')
        });
    });

    it('puts the done action', () => {
        expect(setConnectionStringsSagaGenerator.next(['connectionString2'])).toEqual({
            done: false,
            value: put(setConnectionStringsAction.done({params: ['connectionString2'], result: ['connectionString2']}))
        });

        expect(setConnectionStringsSagaGenerator.next().done).toEqual(true);
    });
});
