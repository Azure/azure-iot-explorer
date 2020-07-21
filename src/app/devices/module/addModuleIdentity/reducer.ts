/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { reducerWithInitialState } from 'typescript-fsa-reducers';
import { addModuleStateInitial, AddModuleStateType } from './state';
import { addModuleIdentityAction } from './actions';
import { SynchronizationStatus } from '../../../api/models/synchronizationStatus';

export const addModuleIdentityReducer = reducerWithInitialState<AddModuleStateType>(addModuleStateInitial())
    .case(addModuleIdentityAction.started, (state: AddModuleStateType) => {
        return state.merge({
            synchronizationStatus: SynchronizationStatus.working
        });
    })
    .case(addModuleIdentityAction.done, (state: AddModuleStateType) => {
        return state.merge({
            synchronizationStatus: SynchronizationStatus.upserted
        });
    })
    .case(addModuleIdentityAction.failed, (state: AddModuleStateType) => {
        return state.merge({
            synchronizationStatus: SynchronizationStatus.failed
        });
    });
