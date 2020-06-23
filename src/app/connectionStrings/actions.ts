/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import actionCreatorFactory from 'typescript-fsa';
import { DELETE, SET, UPSERT } from '../constants/actionTypes';

export const CONNECTION_STRINGS = 'CONNECTION_STRINGS';
export interface UpsertConnectionStringActionPayload {
    newConnectionString: string;
    connectionString?: string;
}

const actionCreator = actionCreatorFactory(CONNECTION_STRINGS);

export const deleteConnectionStringAction = actionCreator<string>(DELETE);
export const setConnectionStringsAction = actionCreator.async<string[], string[]>(SET);
export const upsertConnectionStringAction = actionCreator.async<UpsertConnectionStringActionPayload, string[]>(UPSERT);
