/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { takeEvery, takeLatest } from 'redux-saga/effects';
import { listDevicesSaga } from './sagas/listDeviceSaga';
import { deleteDevicesSaga } from './sagas/deleteDeviceSaga';
import { addDeviceSaga } from './sagas/addDeviceSaga';
import { listDevicesAction, deleteDevicesAction, addDeviceAction, fetchInterfacesAction } from './actions';
import { fetchDigitalTwinInterfacePropertiesSaga } from './sagas/fetchDigitalTwinInterfacePropertiesSaga';

export default [
    takeLatest(listDevicesAction.started.type, listDevicesSaga),
    takeEvery(deleteDevicesAction.started.type, deleteDevicesSaga),
    takeEvery(addDeviceAction.started, addDeviceSaga),
    takeEvery(fetchInterfacesAction.started, fetchDigitalTwinInterfacePropertiesSaga)
];
