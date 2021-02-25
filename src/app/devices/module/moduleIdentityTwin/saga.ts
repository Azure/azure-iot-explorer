/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { all, takeEvery, takeLatest } from 'redux-saga/effects';
import { getModuleIdentityTwinAction, updateModuleIdentityTwinAction } from './actions';
import { getModuleIdentityTwinSaga } from './sagas/getModuleIdentityTwinSaga';
import { updateModuleIdentityTwinSaga } from './sagas/updateModuleIdentityTwinSaga';

export function* moduleIdentityTwinSaga() {
    yield all([
        takeLatest(getModuleIdentityTwinAction.started.type, getModuleIdentityTwinSaga),
        takeEvery(updateModuleIdentityTwinAction.started.type, updateModuleIdentityTwinSaga)
    ]);
}
