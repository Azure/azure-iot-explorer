/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { SynchronizationWrapper } from './synchronizationWrapper';
import { ModelDefinition } from './modelDefinition';
import { REPOSITORY_LOCATION_TYPE } from '../../constants/repositoryLocationTypes';

interface RepositorySource {
    source?: REPOSITORY_LOCATION_TYPE;
}

export type ModelDefinitionWithSourceWrapper = SynchronizationWrapper<ModelDefinition> & RepositorySource;
