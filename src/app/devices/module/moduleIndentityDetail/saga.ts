/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { takeEvery, takeLatest, all } from 'redux-saga/effects';
import { getModuleIdentityAction, deleteModuleIdentityAction } from './actions';
import { getModuleIdentitySaga } from './sagas/getModuleIdentitySaga';
import { deleteModuleIdentitySaga } from './sagas/deleteModuleIdentitySaga';

export function* moduleIdentityDetailSaga() {
    yield all([
        takeLatest(getModuleIdentityAction.started.type, getModuleIdentitySaga),
        takeEvery(deleteModuleIdentityAction.started.type, deleteModuleIdentitySaga)
    ]);
}
