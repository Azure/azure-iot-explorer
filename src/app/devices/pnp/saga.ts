/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { takeEvery, takeLatest, all } from 'redux-saga/effects';
import { getDeviceTwinAction, getModelDefinitionAction, invokeDigitalTwinInterfaceCommandAction, updateDeviceTwinAction } from './actions';
import { getModelDefinitionSaga } from './sagas/getModelDefinitionSaga';
import { invokeDigitalTwinInterfaceCommandSaga } from './sagas/digitalTwinInterfaceCommandSaga';
import { getDeviceTwinSaga } from '../deviceTwin/sagas/getDeviceTwinSaga';
import { updateDeviceTwinSaga } from '../deviceTwin/sagas/updateDeviceTwinSaga';

export function* pnpSaga()  {
    yield all([
        takeLatest(getDeviceTwinAction.started.type, getDeviceTwinSaga),
        takeLatest(getModelDefinitionAction.started.type, getModelDefinitionSaga),
        takeEvery(invokeDigitalTwinInterfaceCommandAction.started.type, invokeDigitalTwinInterfaceCommandSaga),
        takeEvery(updateDeviceTwinAction.started.type, updateDeviceTwinSaga),
    ]);
}
