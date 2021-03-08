/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import actionCreatorFactory from 'typescript-fsa';
import { DEVICECONTENT } from '../../constants/actionPrefixes';
import { FETCH_MODEL_DEFINITION, INVOKE_DIGITAL_TWIN_INTERFACE_COMMAND, GET_TWIN, UPDATE_TWIN } from '../../constants/actionTypes';
import { ModelDefinitionWithSource } from '../../api/models/modelDefinitionWithSource';
import { RepositoryLocationSettings } from '../../shared/global/state';
import { ParsedJsonSchema } from '../../api/models/interfaceJsonParserOutput';
import { Twin } from '../../api/models/device';

const deviceContentCreator = actionCreatorFactory(DEVICECONTENT);
const getModelDefinitionAction = deviceContentCreator.async<GetModelDefinitionActionParameters, ModelDefinitionWithSource>(FETCH_MODEL_DEFINITION);
const invokeDigitalTwinInterfaceCommandAction = deviceContentCreator.async<InvokeDigitalTwinInterfaceCommandActionParameters, string>(INVOKE_DIGITAL_TWIN_INTERFACE_COMMAND);
const getDeviceTwinAction = deviceContentCreator.async<string, Twin>(GET_TWIN);
const updateDeviceTwinAction = deviceContentCreator.async<Partial<Twin>, Twin>(UPDATE_TWIN);

export {
    getModelDefinitionAction,
    invokeDigitalTwinInterfaceCommandAction,
    getDeviceTwinAction,
    updateDeviceTwinAction
};

export interface InvokeDigitalTwinInterfaceCommandActionParameters {
    digitalTwinId: string;
    commandName: string;
    componentName: string;
    commandPayload: boolean | number | string | object;
    responseSchema: ParsedJsonSchema;
}

export interface GetModelDefinitionActionParameters {
    digitalTwinId: string;
    interfaceId: string;
    locations: RepositoryLocationSettings[];
}
