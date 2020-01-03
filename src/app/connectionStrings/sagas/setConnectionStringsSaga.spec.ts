/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { call } from 'redux-saga/effects';
import { cloneableGenerator } from 'redux-saga/utils';
import { setConnectionStringsAction } from '../actions';
import { getConnectionStrings, setConnectionStringsSaga, setConnectionStrings } from './setConnectionStringsSaga';
import { CONNECTION_STRING_NAME_LIST } from '../../constants/browserStorage';

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

describe('setConnectionStringsSaga', () => {
    const setConnectionStringsSagaGenerator = cloneableGenerator(setConnectionStringsSaga)(setConnectionStringsAction(['connectionString2']));
    it('returns call effect to set connection strings', () => {
        expect(setConnectionStringsSagaGenerator.next()).toEqual({
            done: false,
            value: call(setConnectionStrings, 'connectionString2')
        });
    });

    it('finishes', () => {
        expect(setConnectionStringsSagaGenerator.next()).toEqual({
            done: true,
        });
    });
});
