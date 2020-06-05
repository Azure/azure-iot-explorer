/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { reducerWithInitialState } from 'typescript-fsa-reducers';
import { DeviceContentStateType, deviceContentStateInitial } from './state';
import {
    getDeviceIdentityAction,
    updateDeviceIdentityAction,
} from './actions';
import { DeviceIdentity } from '../../api/models/deviceIdentity';
import { SynchronizationStatus } from '../../api/models/synchronizationStatus';

export const deviceContentReducer = reducerWithInitialState<DeviceContentStateType>(deviceContentStateInitial())
    .case(getDeviceIdentityAction.started, (state: DeviceContentStateType) => {
        return state.merge({
            deviceIdentity: {
                synchronizationStatus: SynchronizationStatus.working
            }
        });
    })
    .case(getDeviceIdentityAction.done, (state: DeviceContentStateType, payload: {params: string, result: DeviceIdentity}) => {
        return state.merge({
            deviceIdentity: {
                payload: payload.result,
                synchronizationStatus: SynchronizationStatus.fetched
            }
        });
    })
    .case(getDeviceIdentityAction.failed, (state: DeviceContentStateType) => {
        return state.merge({
            deviceIdentity: {
                synchronizationStatus: SynchronizationStatus.failed
            }
        });
    })
    .case(updateDeviceIdentityAction.started, (state: DeviceContentStateType) => {
        return state.merge({
            deviceIdentity: {
                payload: state.deviceIdentity.payload,
                synchronizationStatus: SynchronizationStatus.updating
            }
        });
    })
    .case(updateDeviceIdentityAction.done, (state: DeviceContentStateType, payload: {params: DeviceIdentity, result: DeviceIdentity}) => {
        return state.merge({
            deviceIdentity: {
                payload: payload.result,
                synchronizationStatus: SynchronizationStatus.upserted
            }
        });
    })
    .case(updateDeviceIdentityAction.failed, (state: DeviceContentStateType) => {
        return state.merge({
            deviceIdentity: {
                payload: state.deviceIdentity.payload,
                synchronizationStatus: SynchronizationStatus.failed
            }
        });
    });
