/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { takeLatest } from 'redux-saga/effects';
import { getAuthenticatinTokenAction, loginAction, logoutAction } from './actions';
import { getTokenSaga } from './sagas/getAuthenticationTokenSaga';
import { loginSaga } from './sagas/loginSaga';
import { logoutSaga } from './sagas/logoutSaga';

export function* authenticationSaga() {
    yield takeLatest(getAuthenticatinTokenAction.started, getTokenSaga);
    yield takeLatest(loginAction.started, loginSaga);
    yield takeLatest(logoutAction.started, logoutSaga);
}
