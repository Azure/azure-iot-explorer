/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { reducerWithInitialState } from 'typescript-fsa-reducers';
import { setSettingsVisibilityAction, setSettingsRepositoryLocationsAction } from './actions';
import { applicationStateInitial, ApplicationStateType, RepositoryLocationSettings } from './state';
import { REPO_LOCATIONS } from '../constants/browserStorage';
import { REPOSITORY_LOCATION_TYPE } from './../constants/repositoryLocationTypes';
import { LOCAL_FILE_EXPLORER_PATH_NAME } from './../constants/browserStorage';

const reducer = reducerWithInitialState<ApplicationStateType>(applicationStateInitial())
    .case(setSettingsVisibilityAction, (state: ApplicationStateType, payload: boolean) => {
        return state.merge({
            showSettings: payload
        });
    })

    .case(setSettingsRepositoryLocationsAction, (state: ApplicationStateType, payload: RepositoryLocationSettings[]) => {
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
        return state.merge({
            localFolderSettings,
            repositoryLocations: locations
        });
    });
export default reducer;
