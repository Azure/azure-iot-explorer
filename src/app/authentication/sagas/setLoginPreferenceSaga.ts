/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { put } from 'redux-saga/effects';
import { Action } from 'typescript-fsa';
import { AUTHENTICATION_METHOD_PREFERENCE } from '../../constants/browserStorage';
import { setLoginPreferenceAction } from '../actions';
import { AuthenticationMethodPreference } from '../state';

export function* setLoginPreferenceSaga(action: Action<AuthenticationMethodPreference>) {
    localStorage.setItem(AUTHENTICATION_METHOD_PREFERENCE, action.payload);
    yield put(setLoginPreferenceAction.done({params: action.payload}));
}
