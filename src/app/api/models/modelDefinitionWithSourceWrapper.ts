/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { ModelDefinition } from './modelDefinition';
import { ErrorResponse } from './errorResponse';
import { SynchronizationStatus } from './synchronizationStatus';
import { REPOSITORY_LOCATION_TYPE } from '../../constants/repositoryLocationTypes';

export interface ModelDefinitionWithSourceWrapper {
    modelDefinition?: ModelDefinition;
    source: REPOSITORY_LOCATION_TYPE;
    modelDefinitionSynchronizationStatus: SynchronizationStatus;
    error?: ErrorResponse;
}
