/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { reducerWithInitialState } from 'typescript-fsa-reducers';
import { PnpStateType, pnpStateInitial } from './state';
import {
    getModelDefinitionAction,
    GetModelDefinitionActionParameters,
    getDeviceTwinAction,
    updateDeviceTwinAction,
} from './actions';
import { SynchronizationStatus } from '../../api/models/synchronizationStatus';
import { ModelDefinitionWithSource } from '../../api/models/modelDefinitionWithSource';
import { Twin } from '../../api/models/device';

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
    .case(getDeviceTwinAction.done, (state: PnpStateType, payload: {params: string, result: Twin}) => {
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
    .case(updateDeviceTwinAction.done, (state: PnpStateType, payload: {params: Twin, result: Twin}) => {
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
    });
