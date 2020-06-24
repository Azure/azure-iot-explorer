/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { call, put } from 'redux-saga/effects';
import { Action } from 'typescript-fsa';
import { setConnectionStrings } from './setConnectionStringsSaga';
import { getConnectionStrings } from './getConnectionStringsSaga';
import { deleteConnectionStringAction } from '../actions';

export function* deleteConnectionStringSaga(action: Action<string>) {
    const savedStrings: string[] = yield call(getConnectionStrings);

    if (savedStrings && savedStrings.length > 0) {
        const nonDuplicateStrings = savedStrings.filter(name => name !== action.payload); // remove duplicates
        const updatedStrings = nonDuplicateStrings.filter(s => s !== action.payload);
        yield call(setConnectionStrings, updatedStrings.join(','));
        yield put(deleteConnectionStringAction.done({params: action.payload, result: updatedStrings}));
    }
}
