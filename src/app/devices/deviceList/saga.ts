/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { takeEvery, takeLatest, all } from 'redux-saga/effects';
import { listDevicesSaga } from './sagas/listDeviceSaga';
import { deleteDevicesSaga } from './sagas/deleteDeviceSaga';
import { listDevicesAction, deleteDevicesAction } from './actions';
import { loggerSaga } from '../../shared/appTelemetry/appTelemetrySaga';

export function* deviceListSaga() {
    yield all([
        takeLatest(listDevicesAction.started.type, listDevicesSaga),
        takeEvery(deleteDevicesAction.started.type, deleteDevicesSaga),
        takeEvery('*', loggerSaga)
    ]);
}
