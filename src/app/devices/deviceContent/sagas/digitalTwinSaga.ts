/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { call, put } from 'redux-saga/effects';
import { Action } from 'typescript-fsa';
import { fetchDigitalTwin } from '../../../api/services/digitalTwinService';
import { FetchDigitalTwinParameters } from '../../../api/parameters/deviceParameters';
import { getDigitalTwinAction } from './../actions';
import { getActiveAzureResourceConnectionStringSaga } from '../../../azureResource/sagas/getActiveAzureResourceConnectionStringSaga';

export function* getDigitalTwinSaga(action: Action<string>) {
    try {
        const parameters: FetchDigitalTwinParameters = {
            connectionString: yield call(getActiveAzureResourceConnectionStringSaga),
            digitalTwinId: action.payload,
        };

        const digitalTwinInterfaceProperties = yield call(fetchDigitalTwin, parameters);

        yield put(getDigitalTwinAction.done({params: action.payload, result: digitalTwinInterfaceProperties}));
    } catch (error) {
        yield put(getDigitalTwinAction.failed({params: action.payload, error}));
    }
}
