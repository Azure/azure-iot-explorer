/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { call, put } from 'redux-saga/effects';
import { Action } from 'typescript-fsa';
import { setConnectionStrings } from './setConnectionStringsSaga';
import { getConnectionStrings } from './getConnectionStringsSaga';
import { deleteConnectionStringAction } from '../actions';
import { ConnectionStringWithExpiry } from '../state';

export function* deleteConnectionStringSaga(action: Action<string>) {
    const savedStrings: ConnectionStringWithExpiry[] = yield call(getConnectionStrings);

    if (savedStrings && savedStrings.length > 0) {
        const updatedStrings = savedStrings.filter(s => s.connectionString !== action.payload);
        yield call(setConnectionStrings, updatedStrings);
        yield put(deleteConnectionStringAction.done({params: action.payload, result: updatedStrings}));
    }
    else {
        yield put(deleteConnectionStringAction.done({params: action.payload, result: []}));
    }
}
