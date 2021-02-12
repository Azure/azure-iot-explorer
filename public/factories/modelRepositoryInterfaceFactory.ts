/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { MESSAGE_CHANNELS } from '../constants';
import { ModelRepositoryInterface, GetInterfaceDefinitionParameters, GetDirectoriesParameters } from '../interfaces/modelRepositoryInterface';
import { invokeInMainWorld } from '../utils/invokeHelper';

export const generateModelRepositoryInterface = (): ModelRepositoryInterface => {
    return {
        getInterfaceDefinition: async (params: GetInterfaceDefinitionParameters): Promise<object | undefined>  => {
            return invokeInMainWorld<object | undefined>(MESSAGE_CHANNELS.MODEL_REPOSITORY_GET_DEFINITION, params);
        }
    };
};
