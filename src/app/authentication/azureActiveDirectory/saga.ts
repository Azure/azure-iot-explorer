/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { takeLatest } from 'redux-saga/effects';
import { getUserProfileTokenAction, loginAction, logoutAction, getSubscriptionListAction, getIotHubsBySubscriptionAction, getIoTHubKeyAction } from './actions';
import { getTokenSaga } from './sagas/getUserProfileTokenSaga';
import { loginSaga } from './sagas/loginSaga';
import { logoutSaga } from './sagas/logoutSaga';
import { getSubscriptionListSaga } from './sagas/getSubscriptionListSaga';
import { getIotHubListSaga } from './sagas/getIotHubListSaga';
import { getIotHubKeySaga } from './sagas/getIotHubKeySaga';

export function* azureActiveDirectorySaga() {
    yield takeLatest(getUserProfileTokenAction.started, getTokenSaga);
    yield takeLatest(loginAction.started, loginSaga);
    yield takeLatest(logoutAction.started, logoutSaga);
    yield takeLatest(getSubscriptionListAction.started, getSubscriptionListSaga);
    yield takeLatest(getIotHubsBySubscriptionAction.started, getIotHubListSaga);
    yield takeLatest(getIoTHubKeyAction.started, getIotHubKeySaga);
}
