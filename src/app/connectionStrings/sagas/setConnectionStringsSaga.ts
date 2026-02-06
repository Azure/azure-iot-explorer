/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { call, put } from 'redux-saga/effects';
import { Action } from 'typescript-fsa';
import { setConnectionStringsAction } from '../actions';
import { ConnectionStringWithExpiry } from '../state';
import { storeConnectionStrings } from '../../shared/utils/credentialStorage';

export function* setConnectionStringsSaga(action: Action<ConnectionStringWithExpiry[]>) {
    yield call(setConnectionStrings, action.payload);
    yield put(setConnectionStringsAction.done({params: action.payload, result: action.payload}));
}

export const setConnectionStrings = async (value: ConnectionStringWithExpiry[]): Promise<void> => {
    await storeConnectionStrings(value);
};
