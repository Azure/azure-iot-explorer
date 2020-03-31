/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { reducerWithInitialState } from 'typescript-fsa-reducers';
import { setSettingsVisibilityAction, setSettingsRepositoryLocationsAction, updateRepoTokenAction } from './actions';
import { applicationStateInitial, ApplicationStateType, PrivateRepositorySettings, RepositoryLocationSettings } from './state';
import { REPO_LOCATIONS } from '../constants/browserStorage';
import { REPOSITORY_LOCATION_TYPE } from './../constants/repositoryLocationTypes';
import { PRIVATE_REPO_CONNECTION_STRING_NAME, LOCAL_FILE_EXPLORER_PATH_NAME } from './../constants/browserStorage';
import { MILLISECONDS_IN_MINUTE, OFFSET_IN_MINUTES } from '../constants/shared';

const reducer = reducerWithInitialState<ApplicationStateType>(applicationStateInitial())
    .case(setSettingsVisibilityAction, (state: ApplicationStateType, payload: boolean) => {
        return state.merge({
            showSettings: payload
        });
    })
    .case(updateRepoTokenAction, (state: ApplicationStateType, payload: PrivateRepositorySettings) => {
        return state.merge({
            privateRepositorySettings: {
                privateConnectionString: payload.privateConnectionString || '',
                privateRepoTimestamp: payload.privateRepoTimestamp,
                privateRepoToken: payload.privateRepoToken
            }
        });
    })
    // tslint:disable-next-line:cyclomatic-complexity
    .case(setSettingsRepositoryLocationsAction, (state: ApplicationStateType, payload: RepositoryLocationSettings[]) => {
        const locations = payload.map(item => item.repositoryLocationType);
        localStorage.setItem(REPO_LOCATIONS, locations.join(','));
        let privateRepositorySettings = null;
        let localFolderSettings = null;
        if (locations.filter(location => location === REPOSITORY_LOCATION_TYPE.Private).length !== 0) {
            const privateRepoSetting = payload.filter(item => item.repositoryLocationType === REPOSITORY_LOCATION_TYPE.Private)[0];
            localStorage.setItem(PRIVATE_REPO_CONNECTION_STRING_NAME, privateRepoSetting.value || '');
            privateRepositorySettings = {
                privateConnectionString: privateRepoSetting && privateRepoSetting.value || '',
                privateRepoTimestamp: new Date().getTime() - (OFFSET_IN_MINUTES * MILLISECONDS_IN_MINUTE),
                privateRepoToken: ''
            };
        }
        if (locations.filter(location => location === REPOSITORY_LOCATION_TYPE.Local).length !== 0) {
            const localFolderSetting = payload.filter(item => item.repositoryLocationType === REPOSITORY_LOCATION_TYPE.Local)[0];
            localStorage.setItem(LOCAL_FILE_EXPLORER_PATH_NAME, localFolderSetting.value || '');
            localFolderSettings = {
                path: localFolderSetting && localFolderSetting.value || ''
            };
        }
        return state.merge({
            localFolderSettings,
            privateRepositorySettings,
            repositoryLocations: locations
        });
    });
export default reducer;
