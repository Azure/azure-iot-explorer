/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { reducerWithInitialState } from 'typescript-fsa-reducers';
import { moduleTwinStateInitial, ModuleTwinStateType } from './state';
import { getModuleIdentityTwinAction, updateModuleIdentityTwinAction,} from './actions';
import { SynchronizationStatus } from '../../../api/models/synchronizationStatus';
import { ModuleTwin } from '../../../api/models/moduleTwin';
import { ModuleIdentityTwinParameters, UpdateModuleIdentityTwinParameters } from '../../../api/parameters/moduleParameters';

export const moduleTwinReducer = reducerWithInitialState<ModuleTwinStateType>(moduleTwinStateInitial())
    .case(getModuleIdentityTwinAction.started, (state: ModuleTwinStateType) => {
        return state.merge({
            synchronizationStatus: SynchronizationStatus.working
        });
    })
    .case(getModuleIdentityTwinAction.done, (state: ModuleTwinStateType, payload: {params: ModuleIdentityTwinParameters} & {result: ModuleTwin}) => {
        return state.merge({
            payload: payload.result,
            synchronizationStatus: SynchronizationStatus.fetched
        });
    })
    .case(getModuleIdentityTwinAction.failed, (state: ModuleTwinStateType) => {
        return state.merge({
            synchronizationStatus: SynchronizationStatus.failed
        });
    })
    .case(updateModuleIdentityTwinAction.started, (state: ModuleTwinStateType) => {
        return state.merge({
            synchronizationStatus: SynchronizationStatus.updating
        });
    })
    .case(updateModuleIdentityTwinAction.done, (state: ModuleTwinStateType, payload: {params: UpdateModuleIdentityTwinParameters} & {result: ModuleTwin}) => {
        return state.merge({
            payload: payload.result,
            synchronizationStatus: SynchronizationStatus.upserted
        });
    })
    .case(updateModuleIdentityTwinAction.failed, (state: ModuleTwinStateType) => {
        return state.merge({
            synchronizationStatus: SynchronizationStatus.failed
        });
    });
