/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { reducerWithInitialState } from 'typescript-fsa-reducers';
import { moduleStateInitial, ModuleStateType } from './state';
import {
    getModuleIdentitiesAction,
    addModuleIdentityAction,
    getModuleIdentityTwinAction,
    GetModuleIdentityTwinActionParameters,
    getModuleIdentityAction,
    GetModuleIdentityActionParameters,
    deleteModuleIdentityAction,
    DeleteModuleIdentityActionParameters
} from './actions';
import { SynchronizationStatus } from '../../api/models/synchronizationStatus';
import { ModuleIdentity } from '../../api/models/moduleIdentity';
import { ModuleTwin } from '../../api/models/moduleTwin';

const reducer = reducerWithInitialState<ModuleStateType>(moduleStateInitial())
    .case(getModuleIdentitiesAction.started, (state: ModuleStateType) => {
        return state.merge({
            moduleIdentityList: {
                synchronizationStatus: SynchronizationStatus.working
            }
        });
    })
    .case(getModuleIdentitiesAction.done, (state: ModuleStateType, payload: {params: string} & {result: ModuleIdentity[]}) => {
        return state.merge({
            moduleIdentityList: {
                moduleIdentities: payload.result,
                synchronizationStatus: SynchronizationStatus.fetched
            }
        });
    })
    .case(getModuleIdentitiesAction.failed, (state: ModuleStateType) => {
        return state.merge({
            moduleIdentityList: {
                synchronizationStatus: SynchronizationStatus.failed
            }
        });
    })
    .case(addModuleIdentityAction.started, (state: ModuleStateType) => {
        return state.merge({
            moduleIdentityList: {
                synchronizationStatus: SynchronizationStatus.working
            }
        });
    })
    .case(addModuleIdentityAction.done, (state: ModuleStateType) => {
        return state.merge({
            moduleIdentityList: {
                synchronizationStatus: SynchronizationStatus.upserted
            }
        });
    })
    .case(addModuleIdentityAction.failed, (state: ModuleStateType) => {
        return state.merge({
            moduleIdentityList: {
                synchronizationStatus: SynchronizationStatus.failed
            }
        });
    })
    .case(getModuleIdentityTwinAction.started, (state: ModuleStateType) => {
        return state.merge({
            moduleIdentityTwin: {
                synchronizationStatus: SynchronizationStatus.working
            }
        });
    })
    .case(getModuleIdentityTwinAction.done, (state: ModuleStateType, payload: {params: GetModuleIdentityTwinActionParameters} & {result: ModuleTwin}) => {
        return state.merge({
            moduleIdentityTwin: {
                moduleIdentityTwin: payload.result,
                synchronizationStatus: SynchronizationStatus.fetched
            }
        });
    })
    .case(getModuleIdentityTwinAction.failed, (state: ModuleStateType) => {
        return state.merge({
            moduleIdentityTwin: {
                synchronizationStatus: SynchronizationStatus.failed
            }
        });
    })
    .case(getModuleIdentityAction.started, (state: ModuleStateType) => {
        return state.merge({
            moduleIdentity: {
                synchronizationStatus: SynchronizationStatus.working
            }
        });
    })
    .case(getModuleIdentityAction.done, (state: ModuleStateType, payload: {params: GetModuleIdentityActionParameters} & {result: ModuleIdentity}) => {
        return state.merge({
            moduleIdentity: {
                moduleIdentity: payload.result,
                synchronizationStatus: SynchronizationStatus.fetched
            }
        });
    })
    .case(getModuleIdentityAction.failed, (state: ModuleStateType) => {
        return state.merge({
            moduleIdentity: {
                synchronizationStatus: SynchronizationStatus.failed
            }
        });
    })
    .case(deleteModuleIdentityAction.started, (state: ModuleStateType) => {
        const moduleList = state.moduleIdentityList.moduleIdentities;
        return state.merge({
            moduleIdentityList: {
                moduleIdentities: moduleList,
                synchronizationStatus: SynchronizationStatus.updating
            }
        });
    })
    .case(deleteModuleIdentityAction.done, (state: ModuleStateType, payload: {params: DeleteModuleIdentityActionParameters}) => {
        const moduleList = state.moduleIdentityList.moduleIdentities;
        const filteredList = moduleList.filter(moduleIdentity => moduleIdentity.moduleId !== payload.params.moduleId);
        return state.merge({
            moduleIdentityList: {
                moduleIdentities: filteredList,
                synchronizationStatus: SynchronizationStatus.deleted
            }
        });
    })
    .case(deleteModuleIdentityAction.failed, (state: ModuleStateType) => {
        const moduleList = state.moduleIdentityList.moduleIdentities;
        return state.merge({
            moduleIdentityList: {
                moduleIdentities: moduleList,
                synchronizationStatus: SynchronizationStatus.failed
            }
        });
    });
export default reducer;
