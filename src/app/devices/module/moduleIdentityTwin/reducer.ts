/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { reducerWithInitialState } from 'typescript-fsa-reducers';
import { moduleTwinStateInitial, ModuleTwinStateType } from './state';
import {
    getModuleIdentityTwinAction,
    GetModuleIdentityTwinActionParameters,
} from './actions';
import { SynchronizationStatus } from '../../../api/models/synchronizationStatus';
import { ModuleIdentity } from '../../../api/models/moduleIdentity';
import { ModuleTwin } from '../../../api/models/moduleTwin';

export const moduleTwinReducer = reducerWithInitialState<ModuleTwinStateType>(moduleTwinStateInitial())
    .case(getModuleIdentityTwinAction.started, (state: ModuleTwinStateType) => {
        return state.merge({
            synchronizationStatus: SynchronizationStatus.working
        });
    })
    .case(getModuleIdentityTwinAction.done, (state: ModuleTwinStateType, payload: {params: GetModuleIdentityTwinActionParameters} & {result: ModuleTwin}) => {
        return state.merge({
            payload: payload.result,
            synchronizationStatus: SynchronizationStatus.fetched
        });
    })
    .case(getModuleIdentityTwinAction.failed, (state: ModuleTwinStateType) => {
        return state.merge({
            synchronizationStatus: SynchronizationStatus.failed
        });
    });
