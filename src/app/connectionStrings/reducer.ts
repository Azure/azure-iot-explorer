/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { reducerWithInitialState } from 'typescript-fsa-reducers';
import { deleteConnectionStringAction, setConnectionStringsAction, upsertConnectionStringAction, UpsertConnectionStringActionPayload } from './actions';
import { connectionStringsStateInitial, ConnectionStringsStateInterface } from './state';
import { SynchronizationStatus } from '../api/models/synchronizationStatus';

export const connectionStringsReducer = reducerWithInitialState<ConnectionStringsStateInterface>(connectionStringsStateInitial())
    .case(deleteConnectionStringAction, (state: ConnectionStringsStateInterface, payload: string) => {
        const updatedState = {...state};
        updatedState.payload = state.payload && state.payload.filter(s => s !== payload);
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

    .case(upsertConnectionStringAction.started, (state: ConnectionStringsStateInterface) => {
        const updatedState = {...state};
        updatedState.synchronizationStatus = SynchronizationStatus.updating;
        return updatedState;
    })

    .case(upsertConnectionStringAction.done, (state: ConnectionStringsStateInterface, payload: {params: UpsertConnectionStringActionPayload, result: string[]}) => {
        const updatedState = {...state};
        updatedState.payload = payload.result;
        updatedState.synchronizationStatus = SynchronizationStatus.upserted;
        return updatedState;
    });
