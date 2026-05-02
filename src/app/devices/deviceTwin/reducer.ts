/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { reducerWithInitialState } from 'typescript-fsa-reducers';
import { deviceTwinStateInitial, DeviceTwinStateType, DeviceTwinStateInterface } from './state';
import { getDeviceTwinAction, updateDeviceTwinAction } from './actions';
import { SynchronizationStatus } from '../../api/models/synchronizationStatus';
import { Twin } from '../../api/models/device';

export const deviceTwinReducer = reducerWithInitialState<DeviceTwinStateInterface>(deviceTwinStateInitial())
    .case(getDeviceTwinAction.started as any, ((state: DeviceTwinStateType) => {
        return state.merge({
            deviceTwin: {
                synchronizationStatus: SynchronizationStatus.working
            }
        });
    }) as any)
    .case(getDeviceTwinAction.done as any, ((state: DeviceTwinStateType, payload: {params: string, result: Twin}) => {
        return state.merge({
            deviceTwin: {
                payload: payload.result,
                synchronizationStatus: SynchronizationStatus.fetched
            }
        });
    }) as any)
    .case(getDeviceTwinAction.failed as any, ((state: DeviceTwinStateType) => {
        return state.merge({
            deviceTwin: {
                synchronizationStatus: SynchronizationStatus.failed
            }
        });
    }) as any)
    .case(updateDeviceTwinAction.started as any, ((state: DeviceTwinStateType) => {
        return state.merge({
            deviceTwin: {
                payload: state.deviceTwin.payload,
                synchronizationStatus: SynchronizationStatus.updating
            }
        });
    }) as any)
    .case(updateDeviceTwinAction.done as any, ((state: DeviceTwinStateType, payload: {params: Twin, result: Twin}) => {
        return state.merge({
            deviceTwin: {
                payload: payload.result,
                synchronizationStatus: SynchronizationStatus.upserted
            }
        });
    }) as any)
    .case(updateDeviceTwinAction.failed as any, ((state: DeviceTwinStateType) => {
        return state.merge({
            deviceTwin: {
                payload: state.deviceTwin.payload,
                synchronizationStatus: SynchronizationStatus.failed
            }
        });
    }) as any);
