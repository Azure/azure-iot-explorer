/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { all, takeLatest, takeEvery } from 'redux-saga/effects';
import { getDeviceTwinAction, updateDeviceTwinAction } from './actions';
import { getDeviceTwinSaga } from './sagas/getDeviceTwinSaga';
import { updateDeviceTwinSaga } from './sagas/updateDeviceTwinSaga';
import { loggerSaga } from '../../shared/appTelemetry/appTelemetrySaga';

export function* deviceTwinSaga() {
    yield all([
        takeLatest(getDeviceTwinAction.started.type, getDeviceTwinSaga),
        takeEvery(updateDeviceTwinAction.started.type, updateDeviceTwinSaga),
        takeEvery('*', loggerSaga)
    ]);
}
