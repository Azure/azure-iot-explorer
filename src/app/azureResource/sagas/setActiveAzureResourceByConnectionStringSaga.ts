/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { Action } from 'typescript-fsa';
import { put } from 'redux-saga/effects';
import { AzureResource } from '../models/azureResource';
import { setActiveAzureResourceAction, SetActiveAzureResourceByConnectionStringActionParameters } from '../actions';
import { setConnectionStringAction } from '../../login/actions';
import { AccessVerificationState } from '../models/accessVerificationState';

export function* setActiveAzureResourceByConnectionStringSaga(action: Action<SetActiveAzureResourceByConnectionStringActionParameters>) {
    const { connectionString, connectionStringList, hostName } = action.payload;
    const azureResource: AzureResource = {
        accessVerificationState: AccessVerificationState.Authorized,
        connectionString,
        hostName
    };

    // temporary until ready to refactor sagas to remove selector
    yield put(setConnectionStringAction({
        connectionString,
        connectionStringList
    }));

    yield put(setActiveAzureResourceAction(azureResource));
}
