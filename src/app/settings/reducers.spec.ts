/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import 'jest';
import { setSettingsVisibilityAction,
    updateRepoTokenAction,
    setSettingsRepositoryLocationsAction
} from './actions';
import reducer from './reducers';
import { applicationStateInitial } from './state';
import { SET_SETTINGS_VISIBILITY, UPDATE_REPO_TOKEN, SET_REPOSITORY_LOCATIONS } from '../constants/actionTypes';
import { REPOSITORY_LOCATION_TYPE } from '../constants/repositoryLocationTypes';
import { PRIVATE_REPO_CONNECTION_STRING_NAME } from '../constants/browserStorage';

describe('settingsReducer', () => {
    const connectionString = 'HostName=test.azure-devices.net;SharedAccessKeyName=iothubowner;SharedAccessKey=test';

    it (`handles ${SET_SETTINGS_VISIBILITY} action`, () => {
        const action = setSettingsVisibilityAction(true);
        expect(reducer(applicationStateInitial(), action).showSettings).toEqual(true);
    });

    it (`handles ${UPDATE_REPO_TOKEN} action`, () => {
        const payload = {
            privateConnectionString: connectionString,
            privateRepoTimestamp: 0,
            privateRepoToken: 'testToken'
        };
        const action = updateRepoTokenAction(payload);
        expect(reducer(applicationStateInitial(), action).privateRepositorySettings).toEqual(payload);
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

        it (`handles ${SET_REPOSITORY_LOCATIONS}/ACTION_DONE action with two location and remembers private repo connection string`, () => {
            // we always remember connection strings
            const payLoad = [
                {
                    connectionString,
                    repositoryLocationType: REPOSITORY_LOCATION_TYPE.Private
                },
                {
                    repositoryLocationType: REPOSITORY_LOCATION_TYPE.Public
                }
            ];
            const action = setSettingsRepositoryLocationsAction(payLoad);
            expect(reducer(applicationStateInitial(), action).repositoryLocations).toEqual([REPOSITORY_LOCATION_TYPE.Private, REPOSITORY_LOCATION_TYPE.Public]);
            expect(reducer(applicationStateInitial(), action).privateRepositorySettings.privateConnectionString).toEqual(connectionString);
            expect(localStorage.getItem(PRIVATE_REPO_CONNECTION_STRING_NAME)).toEqual(connectionString);
        });
    });
});
