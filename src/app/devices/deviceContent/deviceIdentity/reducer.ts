/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { reducerWithInitialState } from 'typescript-fsa-reducers';
import { DeviceIdentityStateInterface, DeviceIdentityStateType, deviceIdentityStateInitial } from './state';
import {
    getDeviceIdentityAction,
    updateDeviceIdentityAction,
} from './actions';
import { DeviceIdentity } from '../../../api/models/deviceIdentity';
import { SynchronizationStatus } from '../../../api/models/synchronizationStatus';

export const deviceIdentityReducer = reducerWithInitialState<DeviceIdentityStateInterface>(deviceIdentityStateInitial())
    .case(getDeviceIdentityAction.started, (state: DeviceIdentityStateType) => {
        return state.merge({
            synchronizationStatus: SynchronizationStatus.working
        });
    })
    .case(getDeviceIdentityAction.done, (state: DeviceIdentityStateType, payload: {params: string, result: DeviceIdentity}) => {
        return state.merge({
            payload: payload.result,
            synchronizationStatus: SynchronizationStatus.fetched
        });
    })
    .case(getDeviceIdentityAction.failed, (state: DeviceIdentityStateType) => {
        return state.merge({
            synchronizationStatus: SynchronizationStatus.failed
        });
    })
    .case(updateDeviceIdentityAction.started, (state: DeviceIdentityStateType) => {
        return state.merge({
            payload: state.payload,
            synchronizationStatus: SynchronizationStatus.updating
        });
    })
    .case(updateDeviceIdentityAction.done, (state: DeviceIdentityStateType, payload: {params: DeviceIdentity, result: DeviceIdentity}) => {
        return state.merge({
            payload: payload.result,
            synchronizationStatus: SynchronizationStatus.upserted
        });
    })
    .case(updateDeviceIdentityAction.failed, (state: DeviceIdentityStateType) => {
        return state.merge({
            payload: state.payload,
            synchronizationStatus: SynchronizationStatus.failed
        });
    });
