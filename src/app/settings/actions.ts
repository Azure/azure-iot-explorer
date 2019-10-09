/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import actionCreatorFactory from 'typescript-fsa';
import * as actionPrefixes from '../constants/actionPrefixes';
import * as actionTypes from '../constants/actionTypes';
import { RepositorySettings } from './components/settingsPane';
import { PrivateRepositorySettings } from './state';
import { Theme } from '../../themer';

const factory = actionCreatorFactory(actionPrefixes.APPLICATION);

export const setSettingsVisibilityAction = factory<boolean>(actionTypes.SET_SETTINGS_VISIBILITY);
export const setSettingsRepositoryLocationsAction = factory<RepositorySettings[]>(actionTypes.SET_REPOSITORY_LOCATIONS);
export const updateRepoTokenAction =  factory<PrivateRepositorySettings>(actionTypes.UPDATE_REPO_TOKEN);
export const setApplicationTheme = factory<Theme>(actionTypes.SET_APPLICATION_THEME);
