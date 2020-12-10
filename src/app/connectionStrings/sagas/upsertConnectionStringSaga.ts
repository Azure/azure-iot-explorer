/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { call, put } from 'redux-saga/effects';
import { Action } from 'typescript-fsa';
import { CONNECTION_STRING_LIST_MAX_LENGTH } from '../../constants/browserStorage';
import { upsertConnectionStringAction } from '../actions';
import { setConnectionStrings } from './setConnectionStringsSaga';
import { getConnectionStrings } from './getConnectionStringsSaga';
import { ConnectionStringWithExpiry } from '../state';

export function* upsertConnectionStringSaga(action: Action<ConnectionStringWithExpiry>) {
    const savedStrings: ConnectionStringWithExpiry[] = yield call(getConnectionStrings);
    let updatedValues: ConnectionStringWithExpiry[];

    if (savedStrings) {
        const nonDuplicateStrings = savedStrings.filter(s => s.connectionString !== action.payload.connectionString); // remove duplicates
        updatedValues = [action.payload, ...nonDuplicateStrings].slice(0, CONNECTION_STRING_LIST_MAX_LENGTH);
    }
    else {
        updatedValues = [action.payload];
    }

    yield call(setConnectionStrings, updatedValues);
    const updatedConnectionString = yield call(getConnectionStrings);
    yield put(upsertConnectionStringAction.done({params: action.payload, result: updatedConnectionString}));
}
