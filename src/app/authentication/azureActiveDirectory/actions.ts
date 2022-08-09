/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import actionCreatorFactory from 'typescript-fsa';

const actionCreator = actionCreatorFactory('AAD');
export const getUserProfileTokenAction = actionCreator.async<void, string>('GET_TOKEN');
export const loginAction = actionCreator.async<void, void>('LOGIN');
export const logoutAction = actionCreator.async<void, void>('LOGOUT');
