/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { call, put } from 'redux-saga/effects';
import { login } from '../../../api/services/authenticationService';
import { loginAction } from '../actions';

export function* loginSaga() {
    yield call(login);
    yield put(loginAction.done({}));
}
