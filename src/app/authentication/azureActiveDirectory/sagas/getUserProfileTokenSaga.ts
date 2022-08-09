/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { call, put } from 'redux-saga/effects';
import { getProfileToken } from '../../../api/services/authenticationService';
import { getUserProfileTokenAction } from '../actions';

export function* getTokenSaga() {
    try {
        const token: string = yield call(getProfileToken);
        yield put(getUserProfileTokenAction.done({result: token}));
    }
    catch (error) {
        yield put(getUserProfileTokenAction.failed({error}));
    }
}
