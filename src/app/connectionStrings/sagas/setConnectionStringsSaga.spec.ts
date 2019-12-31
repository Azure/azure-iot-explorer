/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { call } from 'redux-saga/effects';
import { cloneableGenerator } from 'redux-saga/utils';
import { setConnectionStringsAction } from '../actions';
import { setConnectionStringsSaga } from './setConnectionStringsSaga';
import { setConnectionStrings } from './addConnectionStringSaga';

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
