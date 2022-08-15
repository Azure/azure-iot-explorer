/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { takeLatest } from 'redux-saga/effects';
import { getUserProfileTokenAction, loginAction, logoutAction } from './actions';
import { getTokenSaga } from './sagas/getUserProfileTokenSaga';
import { loginSaga } from './sagas/loginSaga';
import { logoutSaga } from './sagas/logoutSaga';

export function* azureActiveDirectorySaga() {
    yield takeLatest(getUserProfileTokenAction.started, getTokenSaga);
    yield takeLatest(loginAction.started, loginSaga);
    yield takeLatest(logoutAction.started, logoutSaga);
}
