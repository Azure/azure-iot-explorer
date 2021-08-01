/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { call, put } from 'redux-saga/effects';
import { logout } from '../../../api/services/authenticationService';
import { logoutAction } from '../actions';

export function* logoutSaga() {
    yield call(logout);
    yield put(logoutAction.done({}));
}
