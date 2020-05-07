/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { reducerWithInitialState } from 'typescript-fsa-reducers';
import { setRepositoryLocationsAction } from './actions';
import { REPOSITORY_LOCATION_TYPE } from '../constants/repositoryLocationTypes';
import { modelRepositoryStateInitial, ModelRepositoryStateInterface, RepositoryLocationSettings } from './state';

const reducer = reducerWithInitialState<ModelRepositoryStateInterface>(modelRepositoryStateInitial())
    .case(setRepositoryLocationsAction, (state: ModelRepositoryStateInterface, payload: RepositoryLocationSettings[]) => {
        const locationTypes = getRepositoryLocationTypes(payload);
        const localFolderPath = getLocalFolderPath(payload);

        const updatedState = {...state};
        updatedState.localFolderSettings = { path: localFolderPath };
        updatedState.repositoryLocations = locationTypes;

        return updatedState;
    });
export default reducer;

export const getRepositoryLocationTypes = (locations: RepositoryLocationSettings[]): REPOSITORY_LOCATION_TYPE[] => {
    const locationTypes = locations.map(location => location.repositoryLocationType);
    return locationTypes;
};

export const getLocalFolderPath = (locations: RepositoryLocationSettings[]): string => {
    let localFolderSetting = '';
    locations.forEach(s => {
        if (s.repositoryLocationType === REPOSITORY_LOCATION_TYPE.Local) {
            localFolderSetting = s.value || '';
        }
    });

    return localFolderSetting;
};
