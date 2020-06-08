/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { takeEvery, takeLatest, all } from 'redux-saga/effects';
import { getDigitalTwinAction, getModelDefinitionAction, invokeDigitalTwinInterfaceCommandAction, patchDigitalTwinAction } from './actions';
import { getDigitalTwinSaga } from './sagas/getDigitalTwinSaga';
import { getModelDefinitionSaga } from './sagas/getModelDefinitionSaga';
import { invokeDigitalTwinInterfaceCommandSaga } from './sagas/digitalTwinInterfaceCommandSaga';
import { patchDigitalTwinSaga } from './sagas/patchDigitalTwinSaga';

export function* pnpSaga()  {
    yield all([
        takeLatest(getDigitalTwinAction.started.type, getDigitalTwinSaga),
        takeLatest(getModelDefinitionAction.started.type, getModelDefinitionSaga),
        takeEvery(invokeDigitalTwinInterfaceCommandAction.started.type, invokeDigitalTwinInterfaceCommandSaga),
        takeEvery(patchDigitalTwinAction.started.type, patchDigitalTwinSaga),
    ]);
}
