/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { reducerWithInitialState } from 'typescript-fsa-reducers';
import { PnpStateType, pnpStateInitial } from './state';
import {
    getModelDefinitionAction,
    GetModelDefinitionActionParameters,
    getModuleTwinAction,
    getDeviceTwinAction,
    updateDeviceTwinAction,
    updateModuleTwinAction
} from './actions';
import { SynchronizationStatus } from '../../api/models/synchronizationStatus';
import { ModelDefinitionWithSource } from '../../api/models/modelDefinitionWithSource';
import { Twin } from '../../api/models/device';
import { FetchDeviceParameters, UpdateDeviceTwinParameters } from '../../api/parameters/deviceParameters';
import { ModuleIdentityTwinParameters, UpdateModuleIdentityTwinParameters } from '../../api/parameters/moduleParameters';

export const pnpReducer = reducerWithInitialState<PnpStateType>(pnpStateInitial())
    .case(getModelDefinitionAction.started, (state: PnpStateType) => {
        return state.merge({
            modelDefinitionWithSource: {
                synchronizationStatus: SynchronizationStatus.working
            }
        });
    })
    .case(getModelDefinitionAction.done, (state: PnpStateType, payload: {params: GetModelDefinitionActionParameters, result: ModelDefinitionWithSource}) => {
        return state.merge({
            modelDefinitionWithSource: {
                payload: {...payload.result},
                synchronizationStatus: SynchronizationStatus.fetched
            }
        });
    })
    .case(getModelDefinitionAction.failed, (state: PnpStateType) => {
        return state.merge({
            modelDefinitionWithSource: {
                payload: null,
                synchronizationStatus: SynchronizationStatus.failed
            }
        });
    })
    .case(getDeviceTwinAction.started, (state: PnpStateType) => {
        return state.merge({
            twin: {
                synchronizationStatus: SynchronizationStatus.working
            }
        });
    })
    .case(getDeviceTwinAction.done, (state: PnpStateType, payload: {params: FetchDeviceParameters, result: Twin}) => {
        return state.merge({
            twin: {
                payload: payload.result,
                synchronizationStatus: SynchronizationStatus.fetched
            }
        });
    })
    .case(getDeviceTwinAction.failed, (state: PnpStateType) => {
        return state.merge({
            twin: {
                synchronizationStatus: SynchronizationStatus.failed
            }
        });
    })
    .case(updateDeviceTwinAction.started, (state: PnpStateType) => {
        return state.merge({
            twin: {
                payload: state.twin.payload,
                synchronizationStatus: SynchronizationStatus.updating
            }
        });
    })
    .case(updateDeviceTwinAction.done, (state: PnpStateType, payload: {params: UpdateDeviceTwinParameters, result: Twin}) => {
        return state.merge({
            twin: {
                payload: payload.result,
                synchronizationStatus: SynchronizationStatus.upserted
            }
        });
    })
    .case(updateDeviceTwinAction.failed, (state: PnpStateType) => {
        return state.merge({
            twin: {
                payload: state.twin.payload,
                synchronizationStatus: SynchronizationStatus.failed
            }
        });
    })
    .case(getModuleTwinAction.started, (state: PnpStateType) => {
        return state.merge({
            twin: {
                synchronizationStatus: SynchronizationStatus.working
            }
        });
    })
    .case(getModuleTwinAction.done, (state: PnpStateType, payload: {params: ModuleIdentityTwinParameters, result: Twin}) => {
        return state.merge({
            twin: {
                payload: payload.result,
                synchronizationStatus: SynchronizationStatus.fetched
            }
        });
    })
    .case(getModuleTwinAction.failed, (state: PnpStateType) => {
        return state.merge({
            twin: {
                synchronizationStatus: SynchronizationStatus.failed
            }
        });
    })
    .case(updateModuleTwinAction.started, (state: PnpStateType) => {
        return state.merge({
            twin: {
                payload: state.twin.payload,
                synchronizationStatus: SynchronizationStatus.updating
            }
        });
    })
    .case(updateModuleTwinAction.done, (state: PnpStateType, payload: {params: UpdateModuleIdentityTwinParameters, result: Twin}) => {
        return state.merge({
            twin: {
                payload: payload.result,
                synchronizationStatus: SynchronizationStatus.upserted
            }
        });
    })
    .case(updateModuleTwinAction.failed, (state: PnpStateType) => {
        return state.merge({
            twin: {
                payload: state.twin.payload,
                synchronizationStatus: SynchronizationStatus.failed
            }
        });
    });
