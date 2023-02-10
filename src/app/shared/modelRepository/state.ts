/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { REPOSITORY_LOCATION_TYPE } from '../../constants/repositoryLocationTypes';
import { getRepositoryConfigurations } from '../../api/services/modelRepositoryService';

export type ModelRepositoryStateInterface = ModelRepositoryConfiguration[];
export interface ModelRepositoryConfiguration {
    repositoryLocationType: REPOSITORY_LOCATION_TYPE;
    value: string;
}

export const getInitialModelRepositoryState = (): ModelRepositoryStateInterface => (getRepositoryConfigurations());
