/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { REPOSITORY_LOCATION_TYPE } from '../../constants/repositoryLocationTypes';
import { REPO_CONFIGURATIONS } from '../../constants/browserStorage';
import { ModelRepositoryStateInterface } from '../../shared/modelRepository/state';

export const getRepositoryConfigurations = () => {
    const defaultSettings = [{
        repositoryLocationType: REPOSITORY_LOCATION_TYPE.Public,
        value: ''
    }];

    if (localStorage.getItem(REPO_CONFIGURATIONS)) {
        try {
            const result = JSON.parse(localStorage.getItem(REPO_CONFIGURATIONS));
            return Array.isArray(result) ? result : defaultSettings;
        }
        catch {
            return defaultSettings;
        }
    }

    return defaultSettings;
};

export const setRepositoryConfigurations = (config: ModelRepositoryStateInterface) => {
    localStorage.setItem(REPO_CONFIGURATIONS, JSON.stringify(config));
};
