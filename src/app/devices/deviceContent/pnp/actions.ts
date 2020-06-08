/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import actionCreatorFactory from 'typescript-fsa';
import { DEVICECONTENT } from '../../../constants/actionPrefixes';
import { GET_DIGITAL_TWIN, FETCH_MODEL_DEFINITION, INVOKE_DIGITAL_TWIN_INTERFACE_COMMAND, PATCH_DIGITAL_TWIN } from '../../../constants/actionTypes';
import { ModelDefinitionWithSource } from '../../../api/models/modelDefinitionWithSource';
import { PatchPayload } from '../../../api/parameters/deviceParameters';
import { RepositoryLocationSettings } from '../../../shared/global/state';

const deviceContentCreator = actionCreatorFactory(DEVICECONTENT);
const getDigitalTwinAction = deviceContentCreator.async<string, object>(GET_DIGITAL_TWIN);
const getModelDefinitionAction = deviceContentCreator.async<GetModelDefinitionActionParameters, ModelDefinitionWithSource>(FETCH_MODEL_DEFINITION);
const invokeDigitalTwinInterfaceCommandAction = deviceContentCreator.async<InvokeDigitalTwinInterfaceCommandActionParameters, string>(INVOKE_DIGITAL_TWIN_INTERFACE_COMMAND);
const patchDigitalTwinAction = deviceContentCreator.async<PatchDigitalTwinActionParameters, object>(PATCH_DIGITAL_TWIN);

export {
    getDigitalTwinAction,
    getModelDefinitionAction,
    invokeDigitalTwinInterfaceCommandAction,
    patchDigitalTwinAction
};

export interface PatchDigitalTwinActionParameters {
    digitalTwinId: string;
    payload: PatchPayload[];
}

export interface InvokeDigitalTwinInterfaceCommandActionParameters {
    digitalTwinId: string;
    commandName: string;
    componentName: string;
    commandPayload: boolean | number | string | object;
    propertyKey?: string;
}

export interface GetModelDefinitionActionParameters {
    digitalTwinId: string;
    interfaceId: string;
    locations: RepositoryLocationSettings[];
    localFolderPath?: string;
}
