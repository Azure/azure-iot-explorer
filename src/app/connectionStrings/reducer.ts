/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { reducerWithInitialState } from 'typescript-fsa-reducers';
import { deleteConnectionStringAction, setConnectionStringsAction, upsertConnectionStringAction, UpsertConnectionStringActionPayload } from './actions';
import { connectionStringsStateInitial, ConnectionStringsStateInterface, ConnectionStringsStateType } from './state';
import { SynchronizationStatus } from '../api/models/synchronizationStatus';

export const connectionStringsReducer = reducerWithInitialState<ConnectionStringsStateInterface>(connectionStringsStateInitial())
    .case(deleteConnectionStringAction, (state: ConnectionStringsStateInterface, payload: string) => {
        const updatedState = {...state};
        updatedState.payload = state.payload.filter(s => s !== payload);
        return updatedState;
    })

    .case(setConnectionStringsAction.started, (state: ConnectionStringsStateInterface) => {
        const updatedState = {...state};
        updatedState.synchronizationStatus = SynchronizationStatus.updating;
        return updatedState;
    })

    .case(setConnectionStringsAction.done, (state: ConnectionStringsStateInterface, payload: {params: string[], result: string[]}) => {
        const updatedState = {...state};
        updatedState.payload = payload.result;
        updatedState.synchronizationStatus = SynchronizationStatus.upserted;
        return updatedState;
    })

    .case(upsertConnectionStringAction, (state: ConnectionStringsStateInterface, payload: UpsertConnectionStringActionPayload) => {
        const { newConnectionString, connectionString } = payload;
        const updatedState = {...state};
        if (connectionString) {
            updatedState.payload = state.payload.map(s => s === connectionString ? newConnectionString : s);
        } else {
            updatedState.payload = updatedState.payload.filter(s => s !== connectionString);
            updatedState.payload.push(newConnectionString);
        }

        return updatedState;
    });
