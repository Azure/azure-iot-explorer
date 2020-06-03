/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { takeEvery, takeLatest } from 'redux-saga/effects';
import { listDevicesSaga } from './sagas/listDeviceSaga';
import { deleteDevicesSaga } from './sagas/deleteDeviceSaga';
import { listDevicesAction, deleteDevicesAction } from './actions';

export default [
    takeLatest(listDevicesAction.started.type, listDevicesSaga),
    takeEvery(deleteDevicesAction.started.type, deleteDevicesSaga)
];
