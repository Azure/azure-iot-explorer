/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { reducerWithInitialState } from 'typescript-fsa-reducers';
import { setSettingsRepositoryLocationsAction } from './actions';
import { modelRepositoryStateInitial, ModelRepositoryStateInterface, RepositoryLocationSettings } from './state';
import { REPO_LOCATIONS } from '../constants/browserStorage';
import { REPOSITORY_LOCATION_TYPE } from './../constants/repositoryLocationTypes';
import { LOCAL_FILE_EXPLORER_PATH_NAME } from './../constants/browserStorage';

const reducer = reducerWithInitialState<ModelRepositoryStateInterface>(modelRepositoryStateInitial())
    .case(setSettingsRepositoryLocationsAction, (state: ModelRepositoryStateInterface, payload: RepositoryLocationSettings[]) => {
        const locations = payload.map(item => item.repositoryLocationType);
        localStorage.setItem(REPO_LOCATIONS, locations.join(','));
        let localFolderSettings = null;

        if (locations.filter(location => location === REPOSITORY_LOCATION_TYPE.Local).length !== 0) {
            const localFolderSetting = payload.filter(item => item.repositoryLocationType === REPOSITORY_LOCATION_TYPE.Local)[0];
            localStorage.setItem(LOCAL_FILE_EXPLORER_PATH_NAME, localFolderSetting.value || '');
            localFolderSettings = {
                path: localFolderSetting && localFolderSetting.value || ''
            };
        }

        const updatedState = {...state};
        state.localFolderSettings = localFolderSettings;
        state.repositoryLocations = locations;

        return state;
    });
export default reducer;
