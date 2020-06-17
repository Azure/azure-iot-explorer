/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { getLocalFolderPath,  getRepositoryLocations,  setLocalFolderPath, setRepositoryLocations } from './modelRepositoryService';
import { REPOSITORY_LOCATION_TYPE } from '../../constants/repositoryLocationTypes';
import { REPO_LOCATIONS, LOCAL_FILE_EXPLORER_PATH_NAME } from '../../constants/browserStorage';
import { appConfig, HostMode } from '../../../appConfig/appConfig';

describe('setLocalFolderPath', () => {
    it('returns local storage item', () => {
        setLocalFolderPath('localFolderPath');
        expect(localStorage.getItem(LOCAL_FILE_EXPLORER_PATH_NAME)).toEqual('localFolderPath');
    });

});

describe('setRepositoryLocations', () => {
    it('returns local storage item', () => {
        setRepositoryLocations([
            REPOSITORY_LOCATION_TYPE.Local,
            REPOSITORY_LOCATION_TYPE.Public
          ]);

        expect(localStorage.getItem(REPO_LOCATIONS)).toEqual('LOCAL,PUBLIC');
    });
});

describe('getLocalFolderPath', () => {
    it('returns null when HostMode is not electron', () => {
        appConfig.hostMode = HostMode.Browser;
        expect(getLocalFolderPath()).toBeNull();
    });

    it('returns empty string when path name is not set', () => {
        appConfig.hostMode = HostMode.Electron;
        localStorage.setItem(LOCAL_FILE_EXPLORER_PATH_NAME, '');
        expect(getLocalFolderPath()).toEqual('');
    });

    it('returns expected value when HostMode is electron', () => {
        appConfig.hostMode = HostMode.Electron;
        localStorage.setItem(LOCAL_FILE_EXPLORER_PATH_NAME, 'value');
        expect(getLocalFolderPath()).toEqual('value');
    });
});

describe('getRepositoryLocations', () => {
    it('returns empty array if repo locations is undefined', () => {
        localStorage.setItem(REPO_LOCATIONS, '');
        expect(getRepositoryLocations()).toEqual([]);
    });

    it('return expected value when an unknwon type present', () => {
        localStorage.setItem(REPO_LOCATIONS, 'PUBLIC,any');
        expect(getRepositoryLocations()).toEqual([REPOSITORY_LOCATION_TYPE.Public]);
    });

    it('filters local when app config is not electron', () => {
        localStorage.setItem(REPO_LOCATIONS, 'PUBLIC,LOCAL');
        appConfig.hostMode = HostMode.Browser;

        expect(getRepositoryLocations()).toEqual([REPOSITORY_LOCATION_TYPE.Public]);
    });
});
