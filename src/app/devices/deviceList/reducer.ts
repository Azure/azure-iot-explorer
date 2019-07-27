/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { Map as ImmutableMap, fromJS } from 'immutable';
import { reducerWithInitialState } from 'typescript-fsa-reducers';
import { deviceListStateInitial, DeviceListStateType } from './state';
import { listDevicesAction, clearDevicesAction, deleteDevicesAction, addDeviceAction } from './actions';
import { DeviceSummary } from './../../api/models/deviceSummary';
import { SynchronizationStatus } from '../../api/models/synchronizationStatus';
import { DeviceIdentity } from '../../api/models/deviceIdentity';
import DeviceQuery from '../../api/models/deviceQuery';
import { BulkRegistryOperationResult } from '../../api/models/bulkRegistryOperationResult';

const reducer = reducerWithInitialState<DeviceListStateType>(deviceListStateInitial())
    .case(listDevicesAction.started, (state: DeviceListStateType, payload: DeviceQuery) => {
        const devices = state.devices.merge({
            deviceListSynchronizationStatus: SynchronizationStatus.working
        });
        return state.merge({
            deviceQuery: {...payload},
            devices
        });
    })
    .case(listDevicesAction.done, (state: DeviceListStateType, payload: {params: DeviceQuery} & {result: DeviceSummary[]}) => {
        const deviceList = new Map<string, DeviceSummary>();
        payload.result.forEach(item => deviceList.set(item.deviceId, item));
        const devices = state.devices.merge({
            deviceList: fromJS(deviceList),
            deviceListSynchronizationStatus: SynchronizationStatus.fetched
        });
        return state.merge({
            deviceQuery: {...payload.params},
            devices
        });
    })
    .case(listDevicesAction.failed, (state: DeviceListStateType) => {
        const devices = state.devices.merge({
            deviceList: ImmutableMap<string, DeviceSummary>(),
            deviceListSynchronizationStatus: SynchronizationStatus.failed
        });
        return state.merge({
            devices
        });
    })
    .case(addDeviceAction.started, (state: DeviceListStateType) => {
        const devices = state.devices.merge({
            deviceListSynchronizationStatus: SynchronizationStatus.updating
        });
        return state.merge({
            devices
        });
    })
    .case(addDeviceAction.done, (state: DeviceListStateType, payload: {params: DeviceIdentity} & {result: DeviceSummary}) => {
        const devices = state.devices.merge({
            deviceListSynchronizationStatus: SynchronizationStatus.upserted
        });
        return state.merge({
            devices
        });
    })
    .case(addDeviceAction.failed, (state: DeviceListStateType) => {
        const devices = state.devices.merge({
            deviceListSynchronizationStatus: SynchronizationStatus.failed
        });
        return state.merge({
            devices
        });
    })
    .case(deleteDevicesAction.started, (state: DeviceListStateType) => {
        const devices = state.devices.merge({
            deviceListSynchronizationStatus: SynchronizationStatus.updating
        });
        return state.merge({
            devices
        });
    })
    .case(deleteDevicesAction.done, (state: DeviceListStateType, payload: {params: string[]} & {result: BulkRegistryOperationResult}) => {
        const deviceList = state.devices.deviceList;
        payload.params.forEach(id => deviceList.delete(id));
        const devices = state.devices.merge({
            deviceListSynchronizationStatus: SynchronizationStatus.deleted
        });
        return state.merge({
            devices
        });
    })
    .case(deleteDevicesAction.failed, (state: DeviceListStateType) => {
        const devices = state.devices.merge({
            deviceListSynchronizationStatus: SynchronizationStatus.failed
        });
        return state.merge({
            devices
        });
    })
    .case(clearDevicesAction, (state: DeviceListStateType) => {
        const devices = state.devices.merge({
            deviceList: ImmutableMap<string, DeviceSummary>(),
            deviceListSynchronizationStatus: SynchronizationStatus.deleted
        });
        return state.merge({
            devices
        });
    });
export default reducer;
