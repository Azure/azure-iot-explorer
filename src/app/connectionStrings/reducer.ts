/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { reducerWithInitialState } from 'typescript-fsa-reducers';
import { deleteConnectionStringAction, setConnectionStringsAction, upsertConnectionStringAction, UpsertConnectionStringActionPayload, getConnectionStringAction } from './actions';
import { connectionStringsStateInitial, ConnectionStringsStateType } from './state';
import { SynchronizationStatus } from '../api/models/synchronizationStatus';

export const connectionStringsReducer = reducerWithInitialState<ConnectionStringsStateType>(connectionStringsStateInitial())
    .case(getConnectionStringAction.started, (state: ConnectionStringsStateType) => {
        return state.merge({
            synchronizationStatus: SynchronizationStatus.working
        });
    })

    .case(getConnectionStringAction.done, (state: ConnectionStringsStateType, payload: {params: void, result: string[]}) => {
        return state.merge({
            payload: payload.result,
            synchronizationStatus: SynchronizationStatus.fetched
        });
    })

    .case(deleteConnectionStringAction.started, (state: ConnectionStringsStateType) => {
        return state.merge({
            synchronizationStatus: SynchronizationStatus.updating
        });
    })

    .case(deleteConnectionStringAction.done, (state: ConnectionStringsStateType, payload: {params: string, result: string[]}) => {
        return state.merge({
            payload: payload.result,
            synchronizationStatus: SynchronizationStatus.deleted
        });
    })

    .case(setConnectionStringsAction.started, (state: ConnectionStringsStateType) => {
        return state.merge({
            synchronizationStatus: SynchronizationStatus.updating
        });
    })

    .case(setConnectionStringsAction.done, (state: ConnectionStringsStateType, payload: {params: string[], result: string[]}) => {
        return state.merge({
            payload: payload.result,
            synchronizationStatus: SynchronizationStatus.upserted
        });
    })

    .case(upsertConnectionStringAction.started, (state: ConnectionStringsStateType) => {
        return state.merge({
            synchronizationStatus: SynchronizationStatus.updating
        });
    })

    .case(upsertConnectionStringAction.done, (state: ConnectionStringsStateType, payload: {params: UpsertConnectionStringActionPayload, result: string[]}) => {
        return state.merge({
            payload: payload.result,
            synchronizationStatus: SynchronizationStatus.upserted
        });
    });
