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
            value: getRepositorySettingValue(modelRepositoryState, item)
        };
    });
};

// tslint:disable-next-line: cyclomatic-complexity
const getRepositorySettingValue = (modelRepositoryState: ModelRepositoryStateInterface, item: REPOSITORY_LOCATION_TYPE) => {
    switch (item) {
        case REPOSITORY_LOCATION_TYPE.Local:
            return modelRepositoryState.localFolderSettings && modelRepositoryState.localFolderSettings.path || null;
        case REPOSITORY_LOCATION_TYPE.Configurable:
            return modelRepositoryState.configurableRepositorySettings && modelRepositoryState.configurableRepositorySettings.path || null;
        default:
            return null;
        }
};
