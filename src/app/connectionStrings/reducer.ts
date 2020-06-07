/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { reducerWithInitialState } from 'typescript-fsa-reducers';
import { deleteConnectionStringAction, setConnectionStringsAction, upsertConnectionStringAction, UpsertConnectionStringActionPayload } from './actions';
import { connectionStringsStateInitial, ConnectionStringsStateInterface } from './state';

export const connectionStringsReducer = reducerWithInitialState<ConnectionStringsStateInterface>(connectionStringsStateInitial())
    .case(deleteConnectionStringAction, (state: ConnectionStringsStateInterface, payload: string) => {
        const updatedState = {...state};
        updatedState.connectionStrings = state.connectionStrings.filter(s => s !== payload);
        return updatedState;
    })

    .case(setConnectionStringsAction, (state: ConnectionStringsStateInterface, payload: string[]) => {
        const updatedState = {...state};
        updatedState.connectionStrings = payload;
        return updatedState;
    })

    .case(upsertConnectionStringAction, (state: ConnectionStringsStateInterface, payload: UpsertConnectionStringActionPayload) => {
        const { newConnectionString, connectionString } = payload;
        const updatedState = {...state};
        if (connectionString) {
            updatedState.connectionStrings = state.connectionStrings.map(s => s === connectionString ? newConnectionString : s);
        } else {
            updatedState.connectionStrings = updatedState.connectionStrings.filter(s => s !== connectionString);
            updatedState.connectionStrings.push(newConnectionString);
        }

        return updatedState;
    });
