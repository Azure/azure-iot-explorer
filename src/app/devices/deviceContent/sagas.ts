/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { takeEvery, takeLatest } from 'redux-saga/effects';
import { getDeviceIdentitySaga, updateDeviceIdentitySaga } from './sagas/deviceIdentitySaga';
import { getDeviceIdentityAction, updateDeviceIdentityAction } from './actions';

export default [
    takeLatest(getDeviceIdentityAction.started.type, getDeviceIdentitySaga),
    takeEvery(updateDeviceIdentityAction.started.type, updateDeviceIdentitySaga),
];
