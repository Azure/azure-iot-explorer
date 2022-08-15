/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import actionCreatorFactory from 'typescript-fsa';
import { GET, SET } from '../constants/actionTypes';

const actionCreator = actionCreatorFactory('AUTHENTICATION');
export const setLoginPreferenceAction = actionCreator.async<string, void>(SET);
export const getLoginPreferenceAction = actionCreator.async<void, string>(GET);
