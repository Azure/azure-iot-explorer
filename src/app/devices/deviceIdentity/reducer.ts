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
import { DeviceIdentity } from '../../api/models/deviceIdentity';
import { SynchronizationStatus } from '../../api/models/synchronizationStatus';

export const deviceIdentityReducer = reducerWithInitialState<DeviceIdentityStateInterface>(deviceIdentityStateInitial())
    .case(getDeviceIdentityAction.started as any, ((state: DeviceIdentityStateType) => {
        return state.merge({
            synchronizationStatus: SynchronizationStatus.working
        });
    }) as any)
    .case(getDeviceIdentityAction.done as any, ((state: DeviceIdentityStateType, payload: {params: string, result: DeviceIdentity}) => {
        return state.merge({
            payload: payload.result,
            synchronizationStatus: SynchronizationStatus.fetched
        });
    }) as any)
    .case(getDeviceIdentityAction.failed as any, ((state: DeviceIdentityStateType) => {
        return state.merge({
            synchronizationStatus: SynchronizationStatus.failed
        });
    }) as any)
    .case(updateDeviceIdentityAction.started as any, ((state: DeviceIdentityStateType) => {
        return state.merge({
            payload: state.payload,
            synchronizationStatus: SynchronizationStatus.updating
        });
    }) as any)
    .case(updateDeviceIdentityAction.done as any, ((state: DeviceIdentityStateType, payload: {params: DeviceIdentity, result: DeviceIdentity}) => {
        return state.merge({
            payload: payload.result,
            synchronizationStatus: SynchronizationStatus.upserted
        });
    }) as any)
    .case(updateDeviceIdentityAction.failed as any, ((state: DeviceIdentityStateType) => {
        return state.merge({
            payload: state.payload,
            synchronizationStatus: SynchronizationStatus.failed
        });
    }) as any);
