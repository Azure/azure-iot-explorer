/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { call, put } from 'redux-saga/effects';
import { Action } from 'typescript-fsa';
import { fetchDigitalTwin } from '../../../../api/services/digitalTwinService';
import { FetchDigitalTwinParameters } from '../../../../api/parameters/deviceParameters';
import { getDigitalTwinAction } from '../actions';

export function* getDigitalTwinSaga(action: Action<string>) {
    try {
        const parameters: FetchDigitalTwinParameters = {
            digitalTwinId: action.payload,
        };

        const digitalTwin = yield call(fetchDigitalTwin, parameters);

        yield put(getDigitalTwinAction.done({params: action.payload, result: digitalTwin}));
    } catch (error) {
        yield put(getDigitalTwinAction.failed({params: action.payload, error}));
    }
}
