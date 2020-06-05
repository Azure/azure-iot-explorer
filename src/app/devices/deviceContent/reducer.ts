/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { reducerWithInitialState } from 'typescript-fsa-reducers';
import { DeviceContentStateType, deviceContentStateInitial } from './state';
import {
    clearModelDefinitionsAction,
    getModelDefinitionAction,
    setComponentNameAction,
    patchDigitalTwinAction,
    PatchDigitalTwinActionParameters,
    GetModelDefinitionActionParameters,
    getDigitalTwinAction
} from './actions';
import { SynchronizationStatus } from '../../api/models/synchronizationStatus';
import { ModelDefinitionWithSource } from './../../api/models/modelDefinitionWithSource';

const reducer = reducerWithInitialState<DeviceContentStateType>(deviceContentStateInitial())
    //#region Interface-related actions
    .case(getModelDefinitionAction.started, (state: DeviceContentStateType) => {
        return state.merge({
            modelDefinitionWithSource: {
                synchronizationStatus: SynchronizationStatus.working
            }
        });
    })
    .case(getModelDefinitionAction.done, (state: DeviceContentStateType, payload: {params: GetModelDefinitionActionParameters, result: ModelDefinitionWithSource}) => {
        return state.merge({
            modelDefinitionWithSource: {
                payload: {...payload.result},
                synchronizationStatus: SynchronizationStatus.fetched
            }
        });
    })
    .case(getModelDefinitionAction.failed, (state: DeviceContentStateType) => {
        return state.merge({
            modelDefinitionWithSource: {
                payload: null,
                synchronizationStatus: SynchronizationStatus.failed
            }
        });
    })
    .case(clearModelDefinitionsAction, (state: DeviceContentStateType) => {
        return state.merge({
            modelDefinitionWithSource: null
        });
    })
    .case(setComponentNameAction, (state: DeviceContentStateType, payload: string) => {
        return state.merge({
            componentNameSelected: payload
        });
    })
    //#endregion
    //#region DigitalTwin-related actions
    .case(getDigitalTwinAction.started, (state: DeviceContentStateType) => {
        return state.merge({
            digitalTwin: {
                synchronizationStatus: SynchronizationStatus.working
            }
        });
    })
    .case(getDigitalTwinAction.done, (state: DeviceContentStateType, payload: {params: string, result: object}) => {
        return state.merge({
            digitalTwin: {
                payload: payload.result,
                synchronizationStatus: SynchronizationStatus.fetched
            }
        });
    })
    .case(getDigitalTwinAction.failed, (state: DeviceContentStateType) => {
        return state.merge({
            digitalTwin: {
                synchronizationStatus: SynchronizationStatus.failed
            }
        });
    })
    .case(patchDigitalTwinAction.started, (state: DeviceContentStateType) => {
        return state.merge({
            digitalTwin: {
                payload: state.digitalTwin.payload,
                synchronizationStatus: SynchronizationStatus.updating
            }
        });
    })
    .case(patchDigitalTwinAction.done, (state: DeviceContentStateType, payload: {params: PatchDigitalTwinActionParameters, result: object}) => {
        return state.merge({
            digitalTwin: {
                payload: payload.result,
                synchronizationStatus: SynchronizationStatus.upserted
            }
        });
    })
    .case(patchDigitalTwinAction.failed, (state: DeviceContentStateType) => {
        return state.merge({
            digitalTwin: {
                payload: state.digitalTwin.payload,
                synchronizationStatus: SynchronizationStatus.failed
            }
        });
    });
    //#endregion
export default reducer;
