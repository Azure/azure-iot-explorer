/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { reducerWithInitialState } from 'typescript-fsa-reducers';
import { moduleIndentityListStateInitial, ModuleIndentityListStateType as ModuleIdentityListStateType } from './state';
import { getModuleIdentitiesAction } from './actions';
import { SynchronizationStatus } from '../../../api/models/synchronizationStatus';
import { ModuleIdentity } from '../../../api/models/moduleIdentity';
import { FetchModuleIdentitiesParameters } from '../../../api/parameters/moduleParameters';

export const moduleIdentityListReducer = reducerWithInitialState<ModuleIdentityListStateType>(moduleIndentityListStateInitial())
    .case(getModuleIdentitiesAction.started, (state: ModuleIdentityListStateType) => {
        return state.merge({
            synchronizationStatus: SynchronizationStatus.working
        });
    })
    .case(getModuleIdentitiesAction.done, (state: ModuleIdentityListStateType, payload: {params: FetchModuleIdentitiesParameters} & {result: ModuleIdentity[]}) => {
        return state.merge({
            payload: payload.result,
            synchronizationStatus: SynchronizationStatus.fetched
        });
    })
    .case(getModuleIdentitiesAction.failed, (state: ModuleIdentityListStateType) => {
        return state.merge({
            synchronizationStatus: SynchronizationStatus.failed
        });
    });
