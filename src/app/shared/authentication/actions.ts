/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import actionCreatorFactory from 'typescript-fsa';
import { GET } from '../../constants/actionTypes';

const actionCreator = actionCreatorFactory('AUTHENTICATION');
export const getAuthenticatinTokenAction = actionCreator.async<void, string>(GET);
export const loginAction = actionCreator.async<void, void>('LOGIN');
export const logoutAction = actionCreator.async<void, void>('LOGOUT');
