/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { call, put } from 'redux-saga/effects';
import { Action } from 'typescript-fsa';
import { CONNECTION_STRING_NAME_LIST } from '../../constants/browserStorage';
import { setConnectionStringsAction } from '../actions';

export function* setConnectionStringsSaga(action: Action<string[]>) {
    yield call(setConnectionStrings, action.payload.join(','));
    yield put(setConnectionStringsAction.done({params: action.payload, result: action.payload}));
}

export const setConnectionStrings = (value: string): void => {
    return localStorage.setItem(CONNECTION_STRING_NAME_LIST, value);
};
