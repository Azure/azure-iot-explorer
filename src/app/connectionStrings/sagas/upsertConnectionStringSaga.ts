/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { call, put } from 'redux-saga/effects';
import { Action } from 'typescript-fsa';
import { CONNECTION_STRING_LIST_MAX_LENGTH } from '../../constants/browserStorage';
import { UpsertConnectionStringActionPayload, upsertConnectionStringAction } from '../actions';
import { getConnectionStrings, setConnectionStrings } from './setConnectionStringsSaga';

export function* upsertConnectionStringSaga(action: Action<UpsertConnectionStringActionPayload>) {
    const savedStrings: string = yield call(getConnectionStrings);
    let updatedValue: string;

    if (savedStrings) {
        const savedNames = savedStrings.split(',').filter(name => name !== action.payload.connectionString); // remove duplicates
        const updatedNames = [action.payload.newConnectionString, ...savedNames].slice(0, CONNECTION_STRING_LIST_MAX_LENGTH);
        updatedValue = updatedNames.join(',');
    }
    else {
        updatedValue = action.payload.newConnectionString;
    }

    yield call(setConnectionStrings, updatedValue);
    const updatedConnectionString = yield call(getConnectionStrings);
    yield put(upsertConnectionStringAction.done({params: action.payload, result: updatedConnectionString.split(',')}));
}
