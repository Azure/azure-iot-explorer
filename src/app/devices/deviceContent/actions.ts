/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import actionCreatorFactory from 'typescript-fsa';
import * as actionPrefixes from '../../constants/actionPrefixes';
import * as actionTypes from '../../constants/actionTypes';
import { DeviceIdentity } from '../../api/models/deviceIdentity';
import { ModelDefinitionWithSource } from '../../api/models/modelDefinitionWithSource';
import { PatchPayload } from '../../api/parameters/deviceParameters';

const deviceContentCreator = actionCreatorFactory(actionPrefixes.DEVICECONTENT);
const clearModelDefinitionsAction = deviceContentCreator(actionTypes.CLEAR_MODEL_DEFINITIONS);
const getDeviceIdentityAction = deviceContentCreator.async<string, DeviceIdentity> (actionTypes.GET_DEVICE_IDENTITY);
const getDigitalTwinAction = deviceContentCreator.async<string, object>(actionTypes.GET_DIGITAL_TWIN);
const getModelDefinitionAction = deviceContentCreator.async<GetModelDefinitionActionParameters, ModelDefinitionWithSource>(actionTypes.FETCH_MODEL_DEFINITION);
const invokeDigitalTwinInterfaceCommandAction = deviceContentCreator.async<InvokeDigitalTwinInterfaceCommandActionParameters, string>(actionTypes.INVOKE_DIGITAL_TWIN_INTERFACE_COMMAND);
const patchDigitalTwinAction = deviceContentCreator.async<PatchDigitalTwinActionParameters, object>(actionTypes.PATCH_DIGITAL_TWIN);
const setComponentNameAction = deviceContentCreator<string>(actionTypes.SET_COMPONENT_NAME);
const updateDeviceIdentityAction = deviceContentCreator.async<DeviceIdentity, DeviceIdentity> (actionTypes.UPDATE_DEVICE_IDENTITY);

export {
    clearModelDefinitionsAction,
    getDeviceIdentityAction,
    getDigitalTwinAction,
    getModelDefinitionAction,
    invokeDigitalTwinInterfaceCommandAction,
    patchDigitalTwinAction,
    setComponentNameAction,
    updateDeviceIdentityAction
};

export interface PatchDigitalTwinActionParameters {
    digitalTwinId: string;
    payload: PatchPayload[];
}

export interface InvokeDigitalTwinInterfaceCommandActionParameters {
    digitalTwinId: string;
    commandName: string;
    commandPayload: boolean | number | string | object;
    propertyKey?: string;
}

export interface GetModelDefinitionActionParameters {
    digitalTwinId: string;
    interfaceId: string;
}
