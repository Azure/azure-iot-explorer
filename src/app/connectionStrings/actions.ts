/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import actionCreatorFactory from 'typescript-fsa';
import { ADD, DELETE, SET } from '../constants/actionTypes';

export const CONNECTION_STRINGS = 'CONNECTION_STRINGS';
const actionCreator = actionCreatorFactory(CONNECTION_STRINGS);

export const addConnectionStringAction = actionCreator<string>(ADD);
export const deleteConnectionStringAction = actionCreator<string>(DELETE);
export const setConnectionStringsAction = actionCreator<string[]>(SET);
