/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import actionCreatorFactory from 'typescript-fsa';
import { DELETE, SET, UPSERT, GET } from '../constants/actionTypes';
import { ConnectionStringWithExpiry } from './state';

const actionCreator = actionCreatorFactory('CONNECTION_STRINGS');

export const getConnectionStringsAction = actionCreator.async<void, ConnectionStringWithExpiry[]>(GET);
export const setConnectionStringsAction = actionCreator.async<ConnectionStringWithExpiry[], ConnectionStringWithExpiry[]>(SET);
export const upsertConnectionStringAction = actionCreator.async<ConnectionStringWithExpiry, ConnectionStringWithExpiry[]>(UPSERT);
export const deleteConnectionStringAction = actionCreator.async<string, ConnectionStringWithExpiry[]>(DELETE);
