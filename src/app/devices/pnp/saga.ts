/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { takeEvery, takeLatest, all } from 'redux-saga/effects';
import { getDeviceTwinAction, getModelDefinitionAction, getModuleTwinAction, invokeCommandAction, updateDeviceTwinAction, updateModuleTwinAction } from './actions';
import { getModelDefinitionSaga } from './sagas/getModelDefinitionSaga';
import { invokeCommandSaga } from './sagas/invokeCommandSaga';
import { getDeviceTwinSaga } from '../deviceTwin/sagas/getDeviceTwinSaga';
import { updateDeviceTwinSaga } from '../deviceTwin/sagas/updateDeviceTwinSaga';
import { getModuleIdentityTwinSaga } from '../module/moduleIdentityTwin/sagas/getModuleIdentityTwinSaga';
import { updateModuleIdentityTwinSaga } from '../module/moduleIdentityTwin/sagas/updateModuleIdentityTwinSaga';

export function* pnpSaga()  {
    yield all([
        takeLatest(getDeviceTwinAction.started.type, getDeviceTwinSaga),
        takeLatest(getModelDefinitionAction.started.type, getModelDefinitionSaga),
        takeLatest(getModuleTwinAction.started.type, getModuleIdentityTwinSaga),
        takeEvery(invokeCommandAction.started.type, invokeCommandSaga),
        takeEvery(updateDeviceTwinAction.started.type, updateDeviceTwinSaga),
        takeEvery(updateModuleTwinAction.started.type, updateModuleIdentityTwinSaga)
    ]);
}
