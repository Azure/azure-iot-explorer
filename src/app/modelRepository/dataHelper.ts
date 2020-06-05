/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { REPOSITORY_LOCATION_TYPE } from '../constants/repositoryLocationTypes';
import { ModelRepositoryStateInterface } from '../shared/global/state';

export const getRepositoryLocationSettings = (modelRepositoryState: ModelRepositoryStateInterface) => {
    if ( !modelRepositoryState || !modelRepositoryState.repositoryLocations ) {
        return undefined;
    }
    return modelRepositoryState.repositoryLocations.map(item => {
        return {
            repositoryLocationType: item,
            value:
                (item === REPOSITORY_LOCATION_TYPE.Local &&
                    modelRepositoryState.localFolderSettings &&
                    modelRepositoryState.localFolderSettings.path) || null
        };
    });
};
