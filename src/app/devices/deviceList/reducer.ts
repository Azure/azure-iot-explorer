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
        return state.merge({
            deviceQuery: {...payload},
            devices: state.devices.merge({
                deviceListSynchronizationStatus: SynchronizationStatus.working
            })
        });
    })
    .case(listDevicesAction.done, (state: DeviceListStateType, payload: {params: DeviceQuery} & {result: DeviceSummary[]}) => {
        const deviceList = new Map<string, DeviceSummary>();
        payload.result.forEach(item => deviceList.set(item.deviceId, item));
        return state.merge({
            deviceQuery: {...payload.params},
            devices: state.devices.merge({
                deviceList: fromJS(deviceList),
                deviceListSynchronizationStatus: SynchronizationStatus.fetched
            })
        });
    })
    .case(listDevicesAction.failed, (state: DeviceListStateType) => {
        return state.merge({
            devices: state.devices.merge({
                deviceList: ImmutableMap<string, DeviceSummary>(),
                deviceListSynchronizationStatus: SynchronizationStatus.failed
            })
        });
    })
    .case(addDeviceAction.started, (state: DeviceListStateType) => {
        return state.merge({
            devices: state.devices.merge({
                deviceListSynchronizationStatus: SynchronizationStatus.updating
            })
        });
    })
    .case(addDeviceAction.done, (state: DeviceListStateType, payload: {params: DeviceIdentity} & {result: DeviceIdentity}) => {
        return state.merge({
            devices: state.devices.merge({
                deviceListSynchronizationStatus: SynchronizationStatus.upserted
            })
        });
    })
    .case(addDeviceAction.failed, (state: DeviceListStateType) => {
        return state.merge({
            devices: state.devices.merge({
                deviceListSynchronizationStatus: SynchronizationStatus.failed
            })
        });
    })
    .case(deleteDevicesAction.started, (state: DeviceListStateType) => {
        return state.merge({
            devices: state.devices.merge({
                deviceListSynchronizationStatus: SynchronizationStatus.updating
            })
        });
    })
    .case(deleteDevicesAction.done, (state: DeviceListStateType, payload: {params: string[]} & {result: BulkRegistryOperationResult}) => {
        const deviceList = state.devices.deviceList;
        payload.params.forEach(id => deviceList.delete(id));
        return state.merge({
            devices: state.devices.merge({
                deviceListSynchronizationStatus: SynchronizationStatus.deleted
            })
        });
    })
    .case(deleteDevicesAction.failed, (state: DeviceListStateType) => {
        return state.merge({
            devices: state.devices.merge({
                deviceListSynchronizationStatus: SynchronizationStatus.failed
            })
        });
    })
    .case(clearDevicesAction, (state: DeviceListStateType) => {
        return state.merge({
            devices: state.devices.merge({
                deviceList: ImmutableMap<string, DeviceSummary>(),
                deviceListSynchronizationStatus: SynchronizationStatus.deleted
            })
        });
    });
export default reducer;
