/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import actionCreatorFactory from 'typescript-fsa';
import { DEVICECONTENT } from '../../constants/actionPrefixes';
import { FETCH_MODEL_DEFINITION, INVOKE_DEVICE_METHOD, GET_TWIN, UPDATE_TWIN, GET_MODULE_IDENTITY_TWIN, UPDATE_MODULE_IDENTITY_TWIN } from '../../constants/actionTypes';
import { ModelDefinitionWithSource } from '../../api/models/modelDefinitionWithSource';
import { ModelRepositoryConfiguration } from '../../shared/modelRepository/state';
import { ParsedJsonSchema } from '../../api/models/interfaceJsonParserOutput';
import { Twin } from '../../api/models/device';
import { InvokeMethodActionParameters } from '../directMethod/actions';
import { GetModuleIdentityTwinActionParameters } from '../module/moduleIdentityTwin/actions';

const deviceContentCreator = actionCreatorFactory(DEVICECONTENT);
const getModelDefinitionAction = deviceContentCreator.async<GetModelDefinitionActionParameters, ModelDefinitionWithSource>(FETCH_MODEL_DEFINITION);
const invokeCommandAction = deviceContentCreator.async<InvokeCommandActionParameters, string>(INVOKE_DEVICE_METHOD);
const getDeviceTwinAction = deviceContentCreator.async<string, Twin>(GET_TWIN);
const updateDeviceTwinAction = deviceContentCreator.async<Partial<Twin>, Twin>(UPDATE_TWIN);
const getModuleTwinAction = deviceContentCreator.async<GetModuleIdentityTwinActionParameters, Twin>(GET_MODULE_IDENTITY_TWIN);
const updateModuleTwinAction = deviceContentCreator.async<Partial<Twin>, Twin>(UPDATE_MODULE_IDENTITY_TWIN);

export {
    getModelDefinitionAction,
    invokeCommandAction,
    getDeviceTwinAction,
    updateDeviceTwinAction,
    getModuleTwinAction,
    updateModuleTwinAction
};

export interface InvokeCommandActionParameters extends InvokeMethodActionParameters {
    responseSchema: ParsedJsonSchema;
    moduleId: string;
}

export interface GetModelDefinitionActionParameters {
    digitalTwinId: string;
    interfaceId: string;
    locations: ModelRepositoryConfiguration[];
}
