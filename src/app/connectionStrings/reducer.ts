/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { reducerWithInitialState } from 'typescript-fsa-reducers';
import { deleteConnectionStringAction, setConnectionStringsAction, upsertConnectionStringAction, UpsertConnectionStringActionPayload, getConnectionStringAction } from './actions';
import { connectionStringsStateInitial, ConnectionStringsStateInterface } from './state';
import { SynchronizationStatus } from '../api/models/synchronizationStatus';

export const connectionStringsReducer = reducerWithInitialState<ConnectionStringsStateInterface>(connectionStringsStateInitial())
    .case(getConnectionStringAction.started, (state: ConnectionStringsStateInterface) => {
        const updatedState = {...state};
        updatedState.synchronizationStatus = SynchronizationStatus.working;
        return updatedState;
    })

    .case(getConnectionStringAction.done, (state: ConnectionStringsStateInterface, payload: {params: void, result: string[]}) => {
        const updatedState = {...state};
        updatedState.payload = payload.result;
        updatedState.synchronizationStatus = SynchronizationStatus.fetched;
        return updatedState;
    })

    .case(deleteConnectionStringAction.started, (state: ConnectionStringsStateInterface) => {
        const updatedState = {...state};
        updatedState.synchronizationStatus = SynchronizationStatus.updating;
        return updatedState;
    })

    .case(deleteConnectionStringAction.done, (state: ConnectionStringsStateInterface, payload: {params: string, result: string[]}) => {
        const updatedState = {...state};
        updatedState.payload = payload.result;
        updatedState.synchronizationStatus = SynchronizationStatus.deleted;
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
