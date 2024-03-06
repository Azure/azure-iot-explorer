/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { reducerWithInitialState } from 'typescript-fsa-reducers';
import { moduleIdentityDetailStateInterfaceInitial, ModuleIdentityDetailStateType } from './state';
import { getModuleIdentityAction, deleteModuleIdentityAction } from './actions';
import { SynchronizationStatus } from '../../../api/models/synchronizationStatus';
import { ModuleIdentity } from '../../../api/models/moduleIdentity';
import { DeleteModuleIdentityParameters, FetchModuleIdentityParameters } from '../../../api/parameters/moduleParameters';

export const moduleIdentityDetailReducer = reducerWithInitialState<ModuleIdentityDetailStateType>(moduleIdentityDetailStateInterfaceInitial())
    .case(getModuleIdentityAction.started, (state: ModuleIdentityDetailStateType) => {
        return state.merge({
            synchronizationStatus: SynchronizationStatus.working
        });
    })
    .case(getModuleIdentityAction.done, (state: ModuleIdentityDetailStateType, payload: {params: FetchModuleIdentityParameters} & {result: ModuleIdentity}) => {
        return state.merge({
            payload: payload.result,
            synchronizationStatus: SynchronizationStatus.fetched
        });
    })
    .case(getModuleIdentityAction.failed, (state: ModuleIdentityDetailStateType) => {
        return state.merge({
            synchronizationStatus: SynchronizationStatus.failed
        });
    })
    .case(deleteModuleIdentityAction.started, (state: ModuleIdentityDetailStateType) => {
        return state.merge({
            synchronizationStatus: SynchronizationStatus.updating
        });
    })
    .case(deleteModuleIdentityAction.done, (state: ModuleIdentityDetailStateType, payload: {params: DeleteModuleIdentityParameters}) => {
        return state.merge({
            synchronizationStatus: SynchronizationStatus.deleted
        });
    })
    .case(deleteModuleIdentityAction.failed, (state: ModuleIdentityDetailStateType) => {
        return state.merge({
            synchronizationStatus: SynchronizationStatus.failed
        });
    });
