/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import actionCreatorFactory from 'typescript-fsa';
import * as actionPrefixes from '../../constants/actionPrefixes';
import * as actionTypes from '../../constants/actionTypes';
import { Twin } from '../../api/models/device';
import { DeviceIdentity } from '../../api/models/deviceIdentity';
import { ModelDefinitionWithSource } from '../../api/models/modelDefinitionWithSource';
import { JsonPatchOperation } from '../../api/parameters/deviceParameters';

const deviceContentCreator = actionCreatorFactory(actionPrefixes.DEVICECONTENT);
const clearModelDefinitionsAction = deviceContentCreator(actionTypes.CLEAR_MODEL_DEFINITIONS);
const cloudToDeviceMessageAction = deviceContentCreator.async<CloudToDeviceMessageActionParameters, string>(actionTypes.CLOUD_TO_DEVICE_MESSAGE);
const getDeviceIdentityAction = deviceContentCreator.async<string, DeviceIdentity> (actionTypes.GET_DEVICE_IDENTITY);
const getDigitalTwinAction = deviceContentCreator.async<string, object>(actionTypes.GET_DIGITAL_TWIN);
const getTwinAction = deviceContentCreator.async<string, Twin>(actionTypes.GET_TWIN);
const getModelDefinitionAction = deviceContentCreator.async<GetModelDefinitionActionParameters, ModelDefinitionWithSource>(actionTypes.FETCH_MODEL_DEFINITION);
const invokeDirectMethodAction = deviceContentCreator.async<InvokeMethodActionParameters, string>(actionTypes.INVOKE_DEVICE_METHOD);
const invokeDigitalTwinInterfaceCommandAction = deviceContentCreator.async<InvokeDigitalTwinInterfaceCommandActionParameters, string>(actionTypes.INVOKE_DIGITAL_TWIN_INTERFACE_COMMAND);
const patchDigitalTwinAction = deviceContentCreator.async<PatchDigitalTwinActionParameters, object>(actionTypes.PATCH_DIGITAL_TWIN);
const setComponentNameAction = deviceContentCreator<string>(actionTypes.SET_COMPONENT_NAME);
const updateDeviceIdentityAction = deviceContentCreator.async<DeviceIdentity, DeviceIdentity> (actionTypes.UPDATE_DEVICE_IDENTITY);
const updateTwinAction = deviceContentCreator.async<UpdateTwinActionParameters, Twin>(actionTypes.UPDATE_TWIN);

export {
    clearModelDefinitionsAction,
    cloudToDeviceMessageAction,
    getDeviceIdentityAction,
    getDigitalTwinAction,
    getTwinAction,
    getModelDefinitionAction,
    invokeDirectMethodAction,
    invokeDigitalTwinInterfaceCommandAction,
    patchDigitalTwinAction,
    setComponentNameAction,
    updateTwinAction,
    updateDeviceIdentityAction
};

export interface CloudToDeviceMessageActionParameters {
    deviceId: string;
    body: string;
    properties?: Array<{key: string, value: string, isSystemProperty: boolean}>;
}

export interface PatchDigitalTwinActionParameters {
    digitalTwinId: string;
    operation: JsonPatchOperation;
    path: string;
    value?: boolean | number | string | object;
}

export interface InvokeDigitalTwinInterfaceCommandActionParameters {
    digitalTwinId: string;
    commandName: string;
    commandPayload: boolean | number | string | object;
    propertyKey?: string;
}

export interface InvokeMethodActionParameters {
    connectTimeoutInSeconds: number;
    deviceId: string;
    methodName: string;
    payload?: object;
    responseTimeoutInSeconds: number;
}

export interface UpdateTwinActionParameters {
    deviceId: string;
    twin: Twin;
}

export interface GetModelDefinitionActionParameters {
    digitalTwinId: string;
    interfaceId: string;
}
