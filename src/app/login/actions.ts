/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import actionCreatorFactory from 'typescript-fsa';
import * as actionPrefixes from '../constants/actionPrefixes';
import * as actionTypes from '../constants/actionTypes';

const loginCreator = actionCreatorFactory(actionPrefixes.LOGIN);
export const setConnectionStringAction = loginCreator<SetConnectionStringActionParameter>(actionTypes.SET_CONNECTION_STRING);

export interface SetConnectionStringActionParameter {
    connectionString: string;
    connectionStringList: string[];
}
