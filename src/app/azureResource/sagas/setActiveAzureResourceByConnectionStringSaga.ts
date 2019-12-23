/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { Action } from 'typescript-fsa';
import { put } from 'redux-saga/effects';
import { AzureResource } from '../models/azureResource';
import { setActiveAzureResourceAction, SetActiveAzureResourceByConnectionStringActionParameters } from '../actions';
import { setConnectionStringAction } from '../../login/actions';
import { addConnectionStringAction } from '../../connectionStrings/actions';
import { AccessVerificationState } from '../models/accessVerificationState';

export function* setActiveAzureResourceByConnectionStringSaga(action: Action<SetActiveAzureResourceByConnectionStringActionParameters>) {
    const { connectionString, hostName, persistConnectionString } = action.payload;
    const azureResource: AzureResource = {
        accessVerificationState: AccessVerificationState.Authorized,
        connectionString,
        hostName
    };

    if (persistConnectionString) {
        yield put(addConnectionStringAction(connectionString));
    }

    // temporary until ready to refactor sagas to remove selector
    yield put(setConnectionStringAction({
        connectionString,
        rememberConnectionString: persistConnectionString
    }));

    yield put(setActiveAzureResourceAction(azureResource));
}
