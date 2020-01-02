/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { Action } from 'typescript-fsa';
import { call, put, select } from 'redux-saga/effects';
import { setActiveAzureResourceAction, SetActiveAzureResourceByHostNameActionParameters } from '../actions';
import { AccessVerificationState } from '../models/accessVerificationState';
import { StateInterface } from '../../shared/redux/state';

import { getConnectionInfoFromConnectionString } from '../../api/shared/utils';

export function* setActiveAzureResourceByHostNameSaga(action: Action<SetActiveAzureResourceByHostNameActionParameters>) {
    const { hostName } = action.payload;

    const connectionString  = yield select(getLastUsedConnectionString);
    const connectionStringInfo = connectionString ? yield call(getConnectionInfoFromConnectionString, connectionString) : '';

    // until msal implemented -- no manual change of host name alone is authorized
    // todo select against connections strings to retrieve one placed in stored.
    if (hostName === connectionStringInfo.hostName) {
        yield put(setActiveAzureResourceAction({
            accessVerificationState: AccessVerificationState.Authorized,
            connectionString,
            hostName
        }));
    } else {
        yield put(setActiveAzureResourceAction({
            accessVerificationState: AccessVerificationState.Unauthorized,
            hostName
        }));
    }

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

export const getLastUsedConnectionString = (state: StateInterface): string => {
    return state.connectionStringsState.connectionStrings.length > 0 ? state.connectionStringsState.connectionStrings[0] : '';
};
