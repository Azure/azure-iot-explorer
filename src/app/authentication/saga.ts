/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { takeLatest } from 'redux-saga/effects';
import { getLoginPreferenceAction, setLoginPreferenceAction } from './actions';
import { getLoginPreferenceSaga } from './sagas/getLoginPreferenceSaga';
import { setLoginPreferenceSaga } from './sagas/setLoginPreferenceSaga';

export function* authenticationSaga() {
    yield takeLatest(getLoginPreferenceAction.started, getLoginPreferenceSaga);
    yield takeLatest(setLoginPreferenceAction.started, setLoginPreferenceSaga);
}
