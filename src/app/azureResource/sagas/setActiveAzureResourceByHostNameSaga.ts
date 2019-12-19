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
    yield put(setActiveAzureResourceAction({
        accessVerificationState: AccessVerificationState.Verifying,
        hostName
    }));

    try {
        // if no account (waiting on msal)
        if (true) {
            // todo select against connections strings to retrieve one placed in stored.
            yield put(setActiveAzureResourceAction({
                accessVerificationState: AccessVerificationState.Unauthorized,
                hostName
            }));

            return;
        }

        // todo auth check
        //
        // 1. search subscriptions
        // 2. get resource
        // 3. get shared access policies
        // 4. update azure resource

    } catch (e) {
        yield put(setActiveAzureResourceAction({
            accessVerificationState: AccessVerificationState.Failed,
            hostName
        }));
    }
}
