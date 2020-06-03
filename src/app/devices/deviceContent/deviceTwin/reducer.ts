/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { reducerWithInitialState } from 'typescript-fsa-reducers';
import { deviceTwinStateInitial, DeviceTwinStateType, DeviceTwinStateInterface } from './state';
import { getDeviceTwinAction, updateDeviceTwinAction, UpdateTwinActionParameters } from './actions';
import { SynchronizationStatus } from '../../../api/models/synchronizationStatus';
import { Twin } from '../../../api/models/device';

export const deviceTwinReducer = reducerWithInitialState<DeviceTwinStateInterface>(deviceTwinStateInitial())
    .case(getDeviceTwinAction.started, (state: DeviceTwinStateType) => {
        return state.merge({
            deviceTwin: {
                synchronizationStatus: SynchronizationStatus.working
            }
        });
    })
    .case(getDeviceTwinAction.done, (state: DeviceTwinStateType, payload: {params: string, result: Twin}) => {
        return state.merge({
            deviceTwin: {
                payload: payload.result,
                synchronizationStatus: SynchronizationStatus.fetched
            }
        });
    })
    .case(getDeviceTwinAction.failed, (state: DeviceTwinStateType) => {
        return state.merge({
            deviceTwin: {
                synchronizationStatus: SynchronizationStatus.failed
            }
        });
    })
    .case(updateDeviceTwinAction.started, (state: DeviceTwinStateType) => {
        return state.merge({
            deviceTwin: {
                payload: state.deviceTwin.payload,
                synchronizationStatus: SynchronizationStatus.updating
            }
        });
    })
    .case(updateDeviceTwinAction.done, (state: DeviceTwinStateType, payload: {params: UpdateTwinActionParameters, result: Twin}) => {
        return state.merge({
            deviceTwin: {
                payload: payload.result,
                synchronizationStatus: SynchronizationStatus.upserted
            }
        });
    })
    .case(updateDeviceTwinAction.failed, (state: DeviceTwinStateType) => {
        return state.merge({
            deviceTwin: {
                payload: state.deviceTwin.payload,
                synchronizationStatus: SynchronizationStatus.failed
            }
        });
    });
