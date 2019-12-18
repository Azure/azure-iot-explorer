/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import actionCreatorFactory from 'typescript-fsa';
import * as actionPrefixes from '../constants/actionPrefixes';
import { LOG_OUT, SET_CONNECTION_STRING } from '../constants/actionTypes';

const loginCreator = actionCreatorFactory(actionPrefixes.LOGIN);
export const setConnectionStringAction = loginCreator<SetConnectionStringActionParameter>(SET_CONNECTION_STRING);

export const logoutAction = loginCreator<void>(LOG_OUT);

export interface SetConnectionStringActionParameter {
    connectionString: string;
    rememberConnectionString: boolean;
}
