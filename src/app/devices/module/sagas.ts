/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { takeEvery, takeLatest } from 'redux-saga/effects';
import { getModuleIdentitiesSaga, addModuleIdentitySaga, getModuleIdentityTwinSaga, getModuleIdentitySaga } from './sagas/moduleIdentitySaga';
import {
    getModuleIdentitiesAction,
    addModuleIdentityAction,
    getModuleIdentityTwinAction,
    getModuleIdentityAction
    } from './actions';

export default [
    takeEvery(addModuleIdentityAction.started.type, addModuleIdentitySaga),
    takeLatest(getModuleIdentitiesAction.started.type, getModuleIdentitiesSaga),
    takeLatest(getModuleIdentityTwinAction.started.type, getModuleIdentityTwinSaga),
    takeLatest(getModuleIdentityAction.started.type, getModuleIdentitySaga)
];
