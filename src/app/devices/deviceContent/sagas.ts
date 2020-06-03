/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { takeEvery, takeLatest } from 'redux-saga/effects';
import { getModelDefinitionSaga } from './sagas/modelDefinitionSaga';
import { invokeDirectMethodSaga } from './sagas/directMethodSaga';
import { invokeDigitalTwinInterfaceCommandSaga } from './sagas/digitalTwinInterfaceCommandSaga';
import { getDeviceIdentitySaga, updateDeviceIdentitySaga } from './sagas/deviceIdentitySaga';
import { cloudToDeviceMessageSaga } from './sagas/cloudToDeviceMessageSaga';
import { getDigitalTwinSaga, patchDigitalTwinSaga } from './sagas/digitalTwinSaga';
import {
    cloudToDeviceMessageAction,
    getDeviceIdentityAction,
    getDigitalTwinAction,
    invokeDirectMethodAction,
    invokeDigitalTwinInterfaceCommandAction,
    getModelDefinitionAction,
    patchDigitalTwinAction,
    updateDeviceIdentityAction
    } from './actions';

export default [
    takeEvery(cloudToDeviceMessageAction.started.type, cloudToDeviceMessageSaga),
    takeLatest(getDeviceIdentityAction.started.type, getDeviceIdentitySaga),
    takeLatest(getDigitalTwinAction.started.type, getDigitalTwinSaga),
    takeLatest(getModelDefinitionAction.started.type, getModelDefinitionSaga),
    takeEvery(invokeDirectMethodAction.started.type, invokeDirectMethodSaga),
    takeEvery(invokeDigitalTwinInterfaceCommandAction.started.type, invokeDigitalTwinInterfaceCommandSaga),
    takeEvery(patchDigitalTwinAction.started.type, patchDigitalTwinSaga),
    takeEvery(updateDeviceIdentityAction.started.type, updateDeviceIdentitySaga),
];
