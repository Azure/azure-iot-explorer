/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import actionCreatorFactory from 'typescript-fsa';
import * as actionPrefixes from '../../constants/actionPrefixes';
import * as actionTypes from '../../constants/actionTypes';
import { ModelDefinition } from '../../api/models/modelDefinition';
import { Twin } from '../../api/models/device';
import { DeviceIdentity } from '../../api/models/deviceIdentity';
import { DigitalTwinInterfaces } from './../../api/models/digitalTwinModels';
import { REPOSITORY_LOCATION_TYPE } from './../../constants/repositoryLocationTypes';

const deviceContentCreator = actionCreatorFactory(actionPrefixes.DEVICECONTENT);
const clearModelDefinitionsAction = deviceContentCreator(actionTypes.CLEAR_MODEL_DEFINITIONS);
const cloudToDeviceMessageAction = deviceContentCreator.async<CloudToDeviceMessageActionParameters, string>(actionTypes.CLOUD_TO_DEVICE_MESSAGE);
const getDeviceIdentityAction = deviceContentCreator.async<string, DeviceIdentity> (actionTypes.GET_DEVICE_IDENTITY);
const getDigitalTwinInterfacePropertiesAction = deviceContentCreator.async<string, DigitalTwinInterfaces>(actionTypes.GET_DIGITAL_TWIN_INTERFACE_PROPERTIES);
const getTwinAction = deviceContentCreator.async<string, Twin>(actionTypes.GET_TWIN);
const getModelDefinitionAction = deviceContentCreator.async<GetModelDefinitionActionParameters, ModelDefinitionActionResult>(actionTypes.FETCH_MODEL_DEFINITION);
const invokeDirectMethodAction = deviceContentCreator.async<InvokeMethodActionParameters, string>(actionTypes.INVOKE_DEVICE_METHOD);
const invokeDigitalTwinInterfaceCommandAction = deviceContentCreator.async<InvokeDigitalTwinInterfaceCommandActionParameters, string>(actionTypes.INVOKE_DIGITAL_TWIN_INTERFACE_COMMAND);
const patchDigitalTwinInterfacePropertiesAction = deviceContentCreator.async<PatchDigitalTwinInterfacePropertiesActionParameters, DigitalTwinInterfaces>(actionTypes.PATCH_DIGITAL_TWIN_INTERFACE_PROPERTIES);
const setInterfaceIdAction = deviceContentCreator<string>(actionTypes.SET_INTERFACE_ID);
const updateDeviceIdentityAction = deviceContentCreator.async<DeviceIdentity, DeviceIdentity> (actionTypes.UPDATE_DEVICE_IDENTITY);
const updateTwinAction = deviceContentCreator.async<UpdateTwinActionParameters, Twin>(actionTypes.UPDATE_TWIN);
export {
    clearModelDefinitionsAction,
    cloudToDeviceMessageAction,
    getDeviceIdentityAction,
    getDigitalTwinInterfacePropertiesAction,
    getTwinAction,
    getModelDefinitionAction,
    invokeDirectMethodAction,
    invokeDigitalTwinInterfaceCommandAction,
    patchDigitalTwinInterfacePropertiesAction,
    setInterfaceIdAction,
    updateTwinAction,
    updateDeviceIdentityAction
};

export interface CloudToDeviceMessageActionParameters {
    deviceId: string;
    body: string;
    properties?: Array<{key: string, value: string, isSystemProperty: boolean}>;
}

export interface PatchDigitalTwinInterfacePropertiesActionParameters {
    digitalTwinId: string;
    interfacesPatchData: any; // tslint:disable-line:no-any
    propertyKey: string;
}

export interface InvokeDigitalTwinInterfaceCommandActionParameters {
    digitalTwinId: string;
    commandName: string;
    commandPayload: any; // tslint:disable-line:no-any
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

export interface ModelDefinitionActionResult {
    modelDefinition: ModelDefinition;
    source: REPOSITORY_LOCATION_TYPE;
}

export interface GetModelDefinitionActionParameters {
    digitalTwinId: string;
    interfaceId: string;
}
