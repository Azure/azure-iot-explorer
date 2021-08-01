/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { call, put } from 'redux-saga/effects';
import { getProfileToken } from '../../../api/services/authenticationService';
import { getAuthenticatinTokenAction } from '../actions';

export function* getTokenSaga() {
    const token = yield call(getProfileToken);
    yield put(getAuthenticatinTokenAction.done({result: token}));
}
