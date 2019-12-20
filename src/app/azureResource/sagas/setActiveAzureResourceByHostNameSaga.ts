/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { Action } from 'typescript-fsa';
import { put } from 'redux-saga/effects';
import { setActiveAzureResourceAction, SetActiveAzureResourceByHostNameActionParameters } from '../actions';
import { AccessVerificationState } from '../models/accessVerificationState';

export function* setActiveAzureResourceByHostNameSaga(action: Action<SetActiveAzureResourceByHostNameActionParameters>) {
    const { hostName } = action.payload;

    // until msal implemented -- no manual change of host name alone is authorized
    // todo select against connections strings to retrieve one placed in stored.
    yield put(setActiveAzureResourceAction({
        accessVerificationState: AccessVerificationState.Unauthorized,
        hostName
    }));

    // try {
    //     yield call(getAccount);
    //     if (!account) {
    //         yield put(setActiveAzureResourceAction({
    //             accessVerificationState: AccessVerificationState.Unauthorized,
    //             hostName
    //         }));
    //     } else {
    //     // todo auth check
    //     //
    //     // 1. search subscriptions
    //     // 2. get resource
    //     // 3. get shared access policies
    //     // 4. update azure resource
    //     }
    // } catch (e) {
    //     yield put(setActiveAzureResourceAction({
    //         accessVerificationState: AccessVerificationState.Failed,
    //         hostName
    //     }));
    // }
}
