/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { ModelDefinition } from './modelDefinition';
import { REPOSITORY_LOCATION_TYPE } from '../../constants/repositoryLocationTypes';

export interface ModelDefinitionWithSource {
    modelDefinition: ModelDefinition;
    extendedModel?: ModelDefinition;
    source: REPOSITORY_LOCATION_TYPE;
    isModelValid: boolean;
}
