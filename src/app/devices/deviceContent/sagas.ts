/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { takeEvery, takeLatest } from 'redux-saga/effects';
import { getModelDefinitionSaga } from './sagas/modelDefinitionSaga';
import { getDeviceTwinSaga, updateDeviceTwinSaga } from './sagas/deviceTwinSaga';
import { invokeDirectMethodSaga } from './sagas/directMethodSaga';
import { invokeDigitalTwinInterfaceCommandSaga } from './sagas/digitalTwinInterfaceCommandSaga';
import { getDeviceIdentitySaga, updateDeviceIdentitySaga } from './sagas/deviceIdentitySaga';
import { getDigitalTwinInterfacePropertySaga, patchDigitalTwinInterfacePropertiesSaga } from './sagas/digitalTwinInterfacePropertySaga';
import { cloudToDeviceMessageSaga } from './sagas/cloudToDeviceMessageSaga';
import { getModuleIdentitiesSaga } from './sagas/moduleIdentitySaga';
import {
    cloudToDeviceMessageAction,
    getDeviceIdentityAction,
    getDigitalTwinInterfacePropertiesAction,
    getTwinAction,
    invokeDirectMethodAction,
    invokeDigitalTwinInterfaceCommandAction,
    getModelDefinitionAction,
    patchDigitalTwinInterfacePropertiesAction,
    updateTwinAction,
    updateDeviceIdentityAction,
    getModuleIdentitiesAction
    } from './actions';

export default [
    takeEvery(cloudToDeviceMessageAction.started.type, cloudToDeviceMessageSaga),
    takeLatest(getDeviceIdentityAction.started.type, getDeviceIdentitySaga),
    takeLatest(getDigitalTwinInterfacePropertiesAction.started.type, getDigitalTwinInterfacePropertySaga),
    takeLatest(getModelDefinitionAction.started.type, getModelDefinitionSaga),
    takeLatest(getModuleIdentitiesAction.started.type, getModuleIdentitiesSaga),
    takeLatest(getTwinAction.started.type, getDeviceTwinSaga),
    takeEvery(invokeDirectMethodAction.started.type, invokeDirectMethodSaga),
    takeEvery(invokeDigitalTwinInterfaceCommandAction.started.type, invokeDigitalTwinInterfaceCommandSaga),
    takeEvery(patchDigitalTwinInterfacePropertiesAction.started.type, patchDigitalTwinInterfacePropertiesSaga),
    takeEvery(updateTwinAction.started.type, updateDeviceTwinSaga),
    takeEvery(updateDeviceIdentityAction.started.type, updateDeviceIdentitySaga)
];
