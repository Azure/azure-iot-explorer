/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { reducerWithInitialState } from 'typescript-fsa-reducers';
import { moduleIndentityListStateInitial, ModuleIndentityListStateType } from './state';
import { getModuleIdentitiesAction } from './actions';
import { SynchronizationStatus } from '../../../api/models/synchronizationStatus';
import { ModuleIdentity } from '../../../api/models/moduleIdentity';

export const moduleIdentityListReducer = reducerWithInitialState<ModuleIndentityListStateType>(moduleIndentityListStateInitial())
    .case(getModuleIdentitiesAction.started, (state: ModuleIndentityListStateType) => {
        return state.merge({
            synchronizationStatus: SynchronizationStatus.working
        });
    })
    .case(getModuleIdentitiesAction.done, (state: ModuleIndentityListStateType, payload: {params: string} & {result: ModuleIdentity[]}) => {
        return state.merge({
            payload: payload.result,
            synchronizationStatus: SynchronizationStatus.fetched
        });
    })
    .case(getModuleIdentitiesAction.failed, (state: ModuleIndentityListStateType) => {
        return state.merge({
            synchronizationStatus: SynchronizationStatus.failed
        });
    });
