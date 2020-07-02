/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { call, put } from 'redux-saga/effects';
import { CONNECTION_STRING_NAME_LIST } from '../../constants/browserStorage';
import { getConnectionStringAction } from '../actions';

export function* getConnectionStringsSaga() {
    const connectionStrings = yield call(getConnectionStrings);
    yield put(getConnectionStringAction.done({result: connectionStrings}));
}

export const getConnectionStrings = (): string[] => {
    const connectionStrings = localStorage.getItem(CONNECTION_STRING_NAME_LIST);
    return connectionStrings && connectionStrings.split(',') || [];
};
