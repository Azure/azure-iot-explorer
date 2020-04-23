/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import 'jest';
import {
    setSettingsVisibilityAction,
    setSettingsRepositoryLocationsAction
} from './actions';
import reducer from './reducers';
import { applicationStateInitial, RepositoryLocationSettings } from './state';
import { SET_SETTINGS_VISIBILITY, UPDATE_REPO_TOKEN, SET_REPOSITORY_LOCATIONS } from '../constants/actionTypes';
import { REPOSITORY_LOCATION_TYPE } from '../constants/repositoryLocationTypes';
import { LOCAL_FILE_EXPLORER_PATH_NAME } from '../constants/browserStorage';

describe('settingsReducer', () => {
    const connectionString = 'HostName=test.azure-devices.net;SharedAccessKeyName=iothubowner;SharedAccessKey=test';

    it (`handles ${SET_SETTINGS_VISIBILITY} action`, () => {
        const action = setSettingsVisibilityAction(true);
        expect(reducer(applicationStateInitial(), action).showSettings).toEqual(true);
    });

    describe('set repository locations scenarios', () => {
        it (`handles ${SET_REPOSITORY_LOCATIONS}/ACTION_DONE action with only public repo location`, () => {
            const payLoad = [
                {
                    repositoryLocationType: REPOSITORY_LOCATION_TYPE.Public
                }
            ];
            const action = setSettingsRepositoryLocationsAction(payLoad);
            expect(reducer(applicationStateInitial(), action).repositoryLocations).toEqual([REPOSITORY_LOCATION_TYPE.Public]);
        });

        it (`handles ${SET_REPOSITORY_LOCATIONS}/ACTION_DONE action with multiple locations`, () => {
            const path = 'f:/';
            const payLoad: RepositoryLocationSettings[] = [
                {
                    repositoryLocationType: REPOSITORY_LOCATION_TYPE.Public
                },
                {
                    repositoryLocationType: REPOSITORY_LOCATION_TYPE.Local,
                    value: path
                },
            ];
            const action = setSettingsRepositoryLocationsAction(payLoad);
            expect(reducer(applicationStateInitial(), action).repositoryLocations).toEqual([REPOSITORY_LOCATION_TYPE.Public, REPOSITORY_LOCATION_TYPE.Local]);
            expect(reducer(applicationStateInitial(), action).localFolderSettings.path).toEqual(path);
            expect(localStorage.getItem(LOCAL_FILE_EXPLORER_PATH_NAME)).toEqual(path);
        });
    });
});
