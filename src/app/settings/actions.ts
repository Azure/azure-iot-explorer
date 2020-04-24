/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import actionCreatorFactory from 'typescript-fsa';
import * as actionPrefixes from '../constants/actionPrefixes';
import * as actionTypes from '../constants/actionTypes';
import { RepositoryLocationSettings } from './state';

const factory = actionCreatorFactory(actionPrefixes.APPLICATION);

export const setSettingsVisibilityAction = factory<boolean>(actionTypes.SET_SETTINGS_VISIBILITY);
export const setSettingsRepositoryLocationsAction = factory<RepositoryLocationSettings[]>(actionTypes.SET_REPOSITORY_LOCATIONS);
