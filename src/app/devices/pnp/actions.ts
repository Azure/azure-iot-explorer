/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import actionCreatorFactory from 'typescript-fsa';
import { DEVICECONTENT } from '../../constants/actionPrefixes';
import { FETCH_MODEL_DEFINITION, INVOKE_DEVICE_METHOD, GET_TWIN, UPDATE_TWIN } from '../../constants/actionTypes';
import { ModelDefinitionWithSource } from '../../api/models/modelDefinitionWithSource';
import { RepositoryLocationSettings } from '../../shared/global/state';
import { ParsedJsonSchema } from '../../api/models/interfaceJsonParserOutput';
import { Twin } from '../../api/models/device';
import { InvokeMethodActionParameters } from '../directMethod/actions';

const deviceContentCreator = actionCreatorFactory(DEVICECONTENT);
const getModelDefinitionAction = deviceContentCreator.async<GetModelDefinitionActionParameters, ModelDefinitionWithSource>(FETCH_MODEL_DEFINITION);
const invokeCommandAction = deviceContentCreator.async<InvokeMethodActionParameters, string>(INVOKE_DEVICE_METHOD);
const getDeviceTwinAction = deviceContentCreator.async<string, Twin>(GET_TWIN);
const updateDeviceTwinAction = deviceContentCreator.async<Partial<Twin>, Twin>(UPDATE_TWIN);

export {
    getModelDefinitionAction,
    invokeCommandAction,
    getDeviceTwinAction,
    updateDeviceTwinAction
};

export interface InvokeCommandActionParameters extends InvokeMethodActionParameters{
    responseSchema: ParsedJsonSchema;
}

export interface GetModelDefinitionActionParameters {
    digitalTwinId: string;
    interfaceId: string;
    locations: RepositoryLocationSettings[];
}
