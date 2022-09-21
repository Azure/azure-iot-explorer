/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { put } from 'redux-saga/effects';
import { AUTHENTICATION_METHOD_PREFERENCE } from '../../constants/browserStorage';
import { getLoginPreferenceAction } from '../actions';
import { AuthenticationMethodPreference } from '../state';

export function* getLoginPreferenceSaga() {
    const preference  = localStorage.getItem(AUTHENTICATION_METHOD_PREFERENCE);
    yield put(getLoginPreferenceAction.done({result: preference as AuthenticationMethodPreference}));
}
