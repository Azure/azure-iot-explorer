/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { reducerWithInitialState } from 'typescript-fsa-reducers';
import { addDeviceStateInitial, AddDeviceStateType, AddDeviceStateInterface } from './state';
import { addDeviceAction } from './actions';
import { SynchronizationStatus } from '../../api/models/synchronizationStatus';
import { DeviceIdentity } from '../../api/models/deviceIdentity';

export const addDeviceReducer = reducerWithInitialState<AddDeviceStateInterface>(addDeviceStateInitial())
    .case(addDeviceAction.started as any, ((state: AddDeviceStateType) => {
        return state.merge({
            synchronizationStatus: SynchronizationStatus.working
        });
    }) as any)
    .case(addDeviceAction.done as any, ((state: AddDeviceStateType, _payload: {params: DeviceIdentity} & {result: DeviceIdentity}) => {
        return state.merge({
            synchronizationStatus: SynchronizationStatus.upserted
        });
    }) as any)
    .case(addDeviceAction.failed as any, ((state: AddDeviceStateType) => {
        return state.merge({
            synchronizationStatus: SynchronizationStatus.failed
        });
    }) as any);
