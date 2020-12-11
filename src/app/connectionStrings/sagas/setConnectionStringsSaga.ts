/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { call, put } from 'redux-saga/effects';
import { Action } from 'typescript-fsa';
import { CONNECTION_STRING_NAME_LIST } from '../../constants/browserStorage';
import { setConnectionStringsAction } from '../actions';
import { ConnectionStringWithExpiry } from '../state';

export function* setConnectionStringsSaga(action: Action<ConnectionStringWithExpiry[]>) {
    yield call(setConnectionStrings, action.payload);
    yield put(setConnectionStringsAction.done({params: action.payload, result: action.payload}));
}

export const setConnectionStrings = (value: ConnectionStringWithExpiry[]): void => {
    return localStorage.setItem(CONNECTION_STRING_NAME_LIST, JSON.stringify(value));
};
