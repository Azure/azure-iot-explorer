/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { reducerWithInitialState } from 'typescript-fsa-reducers';
import { PnpStateType, pnpStateInitial } from './state';
import {
    getModelDefinitionAction,
    patchDigitalTwinAction,
    PatchDigitalTwinActionParameters,
    GetModelDefinitionActionParameters,
    getDigitalTwinAction
} from './actions';
import { SynchronizationStatus } from '../../../api/models/synchronizationStatus';
import { ModelDefinitionWithSource } from '../../../api/models/modelDefinitionWithSource';

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
    .case(getDigitalTwinAction.started, (state: PnpStateType) => {
        return state.merge({
            digitalTwin: {
                synchronizationStatus: SynchronizationStatus.working
            }
        });
    })
    .case(getDigitalTwinAction.done, (state: PnpStateType, payload: {params: string, result: object}) => {
        return state.merge({
            digitalTwin: {
                payload: payload.result,
                synchronizationStatus: SynchronizationStatus.fetched
            }
        });
    })
    .case(getDigitalTwinAction.failed, (state: PnpStateType) => {
        return state.merge({
            digitalTwin: {
                synchronizationStatus: SynchronizationStatus.failed
            }
        });
    })
    .case(patchDigitalTwinAction.started, (state: PnpStateType) => {
        return state.merge({
            digitalTwin: {
                payload: state.digitalTwin.payload,
                synchronizationStatus: SynchronizationStatus.updating
            }
        });
    })
    .case(patchDigitalTwinAction.done, (state: PnpStateType, payload: {params: PatchDigitalTwinActionParameters, result: object}) => {
        return state.merge({
            digitalTwin: {
                payload: payload.result,
                synchronizationStatus: SynchronizationStatus.upserted
            }
        });
    })
    .case(patchDigitalTwinAction.failed, (state: PnpStateType) => {
        return state.merge({
            digitalTwin: {
                payload: state.digitalTwin.payload,
                synchronizationStatus: SynchronizationStatus.failed
            }
        });
    });
