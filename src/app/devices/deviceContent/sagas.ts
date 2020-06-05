/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { takeEvery, takeLatest } from 'redux-saga/effects';
import { getModelDefinitionSaga } from './sagas/modelDefinitionSaga';
import { invokeDigitalTwinInterfaceCommandSaga } from './sagas/digitalTwinInterfaceCommandSaga';
import { getDigitalTwinSaga, patchDigitalTwinSaga } from './sagas/digitalTwinSaga';
import {
    getDigitalTwinAction,
    invokeDigitalTwinInterfaceCommandAction,
    getModelDefinitionAction,
    patchDigitalTwinAction,
    } from './actions';

export default [
    takeLatest(getDigitalTwinAction.started.type, getDigitalTwinSaga),
    takeLatest(getModelDefinitionAction.started.type, getModelDefinitionSaga),
    takeEvery(invokeDigitalTwinInterfaceCommandAction.started.type, invokeDigitalTwinInterfaceCommandSaga),
    takeEvery(patchDigitalTwinAction.started.type, patchDigitalTwinSaga),
];
