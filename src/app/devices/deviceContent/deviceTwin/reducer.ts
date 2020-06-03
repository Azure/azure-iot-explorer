/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { reducerWithInitialState } from 'typescript-fsa-reducers';
import { deviceTwinStateInitial, DeviceTwinStateType, DeviceTwinStateInterface } from './state';
import { getTwinAction, updateTwinAction, UpdateTwinActionParameters } from './actions';
import { SynchronizationStatus } from '../../../api/models/synchronizationStatus';
import { Twin } from '../../../api/models/device';

export const deviceTwinReducer = reducerWithInitialState<DeviceTwinStateInterface>(deviceTwinStateInitial())
    .case(getTwinAction.started, (state: DeviceTwinStateType) => {
        return state.merge({
            deviceTwin: {
                synchronizationStatus: SynchronizationStatus.working
            }
        });
    })
    .case(getTwinAction.done, (state: DeviceTwinStateType, payload: {params: string, result: Twin}) => {
        return state.merge({
            deviceTwin: {
                payload: payload.result,
                synchronizationStatus: SynchronizationStatus.fetched
            }
        });
    })
    .case(getTwinAction.failed, (state: DeviceTwinStateType) => {
        return state.merge({
            deviceTwin: {
                synchronizationStatus: SynchronizationStatus.failed
            }
        });
    })
    .case(updateTwinAction.started, (state: DeviceTwinStateType) => {
        return state.merge({
            deviceTwin: {
                payload: state.deviceTwin.payload,
                synchronizationStatus: SynchronizationStatus.updating
            }
        });
    })
    .case(updateTwinAction.done, (state: DeviceTwinStateType, payload: {params: UpdateTwinActionParameters, result: Twin}) => {
        return state.merge({
            deviceTwin: {
                payload: payload.result,
                synchronizationStatus: SynchronizationStatus.upserted
            }
        });
    })
    .case(updateTwinAction.failed, (state: DeviceTwinStateType) => {
        return state.merge({
            deviceTwin: {
                payload: state.deviceTwin.payload,
                synchronizationStatus: SynchronizationStatus.failed
            }
        });
    });
