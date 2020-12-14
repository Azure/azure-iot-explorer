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

const stringsWithExpiry = [{
    connectionString: 'connectionString1',
    expiration: (new Date()).toUTCString()
}];

describe('setConnectionString', () => {
    it('sets expected value', () => {
        setConnectionStrings(stringsWithExpiry);

        expect(localStorage.getItem(CONNECTION_STRING_NAME_LIST)).toEqual(JSON.stringify(stringsWithExpiry));
    });
});

describe('setConnectionStringsSaga', () => {
    const setConnectionStringsSagaGenerator = cloneableGenerator(setConnectionStringsSaga)(setConnectionStringsAction.started(stringsWithExpiry));
    it('returns call effect to set connection strings', () => {
        expect(setConnectionStringsSagaGenerator.next()).toEqual({
            done: false,
            value: call(setConnectionStrings, stringsWithExpiry)
        });
    });

    it('puts the done action', () => {
        expect(setConnectionStringsSagaGenerator.next(stringsWithExpiry)).toEqual({
            done: false,
            value: put(setConnectionStringsAction.done({params: stringsWithExpiry, result: stringsWithExpiry}))
        });

        expect(setConnectionStringsSagaGenerator.next().done).toEqual(true);
    });
});
