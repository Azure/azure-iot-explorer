/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { reducerWithInitialState } from 'typescript-fsa-reducers';
import { setSettingsVisibilityAction, setSettingsRepositoryLocationsAction, updateRepoTokenAction } from './actions';
import { applicationStateInitial, ApplicationStateType, OFFSET_IN_MINUTES, PrivateRepositorySettings } from './state';
import { REPO_LOCATIONS, REMEMBER_CONNECTION_STRING, THEME_SELECTION } from '../constants/browserStorage';
import { REPOSITORY_LOCATION_TYPE } from './../constants/repositoryLocationTypes';
import { PRIVATE_REPO_CONNECTION_STRING_NAME } from './../constants/browserStorage';
import { RepositorySettings } from './components/settingsPane';
import { MILLISECONDS_IN_MINUTE } from '../constants/shared';

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
    .case(setSettingsRepositoryLocationsAction, (state: ApplicationStateType, payload: RepositorySettings[]) => {
        const locations = payload.map(item => item.repositoryLocationType);
        localStorage.setItem(REPO_LOCATIONS, locations.join(','));

        if (locations.filter(location => location === REPOSITORY_LOCATION_TYPE.Private).length !== 0) {
            const privateRepoSetting = payload.filter(item => item.repositoryLocationType === REPOSITORY_LOCATION_TYPE.Private)[0];
            if (localStorage.getItem(REMEMBER_CONNECTION_STRING) === 'true') {
                localStorage.setItem(PRIVATE_REPO_CONNECTION_STRING_NAME, privateRepoSetting.connectionString || '');
            }
            else {
                localStorage.setItem(PRIVATE_REPO_CONNECTION_STRING_NAME, '');
            }
            return state.merge({
                privateRepositorySettings: {
                    privateConnectionString: privateRepoSetting && privateRepoSetting.connectionString || '',
                    privateRepoTimestamp: new Date().getTime() - (OFFSET_IN_MINUTES * MILLISECONDS_IN_MINUTE),
                    privateRepoToken: ''
                },
                repositoryLocations: locations,
            });
        }
        else {
            return state.merge({
                repositoryLocations: locations,
            });
        }
    });
export default reducer;
