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
import { DataPlaneResponse, Device } from '../../api/models/device';
import { transformDevice } from '../../api/dataTransforms/deviceSummaryTransform';
import { HEADERS } from '../../constants/apiConstants';

const reducer = reducerWithInitialState<DeviceListStateType>(deviceListStateInitial())
    .case(listDevicesAction.started, (state: DeviceListStateType, payload: DeviceQuery) => {
        return state.merge({
            deviceQuery: {...payload},
            devices: state.devices.merge({
                synchronizationStatus: SynchronizationStatus.working
            })
        });
    })
    // tslint:disable-next-line: cyclomatic-complexity
    .case(listDevicesAction.done, (state: DeviceListStateType, payload: {params: DeviceQuery} & {result: DataPlaneResponse<Device[]>}) => {
        const deviceList = new Map<string, DeviceSummary>();
        const devices = payload.result.body || [];
        devices.forEach(item => deviceList.set(item.DeviceId, transformDevice(item)));
        const continuationTokens = (state.deviceQuery.continuationTokens && [...state.deviceQuery.continuationTokens]) || [];
        const currentPageIndex = payload && payload.params && payload.params.currentPageIndex;

        if (payload.result.headers) {
            // tslint:disable-next-line: no-any
            const newToken = (payload.result.headers as any)[HEADERS.CONTINUATION_TOKEN] || '';
            if ('' !== newToken) {
                if (continuationTokens.length === 0) {
                    // add the first page item
                    continuationTokens.push('');
                }
                if (!continuationTokens.some(x => x === newToken)) {
                    continuationTokens.push(newToken);
                }
            }
        }
        return state.merge({
            devices: state.devices.merge({
                payload: fromJS(deviceList),
                synchronizationStatus: SynchronizationStatus.fetched
            })
        }).set('deviceQuery', {
            ...payload.params,
            continuationTokens,
            currentPageIndex
        });
    })
    .case(listDevicesAction.failed, (state: DeviceListStateType) => {
        return state.merge({
            devices: state.devices.merge({
                payload: ImmutableMap<string, DeviceSummary>(),
                synchronizationStatus: SynchronizationStatus.failed
            })
        });
    })
    .case(addDeviceAction.started, (state: DeviceListStateType) => {
        return state.merge({
            devices: state.devices.merge({
                synchronizationStatus: SynchronizationStatus.updating
            })
        });
    })
    .case(addDeviceAction.done, (state: DeviceListStateType, payload: {params: DeviceIdentity} & {result: DeviceIdentity}) => {
        return state.merge({
            devices: state.devices.merge({
                synchronizationStatus: SynchronizationStatus.upserted
            })
        }).set('deviceQuery', {
            clauses: [],
            continuationTokens: [],
            currentPageIndex: 0,
            deviceId: '',
        });
    })
    .case(addDeviceAction.failed, (state: DeviceListStateType) => {
        return state.merge({
            devices: state.devices.merge({
                synchronizationStatus: SynchronizationStatus.failed
            })
        });
    })
    .case(deleteDevicesAction.started, (state: DeviceListStateType) => {
        return state.merge({
            devices: state.devices.merge({
                synchronizationStatus: SynchronizationStatus.updating
            })
        });
    })
    .case(deleteDevicesAction.done, (state: DeviceListStateType, payload: {params: string[]} & {result: BulkRegistryOperationResult}) => {
        const deviceList = state.devices.payload;
        payload.params.forEach(id => deviceList.delete(id));
        return state.merge({
            devices: state.devices.merge({
                synchronizationStatus: SynchronizationStatus.deleted
            })
        }).set('deviceQuery', {
            clauses: [],
            continuationTokens: [],
            currentPageIndex: 0,
            deviceId: '',
        });
    })
    .case(deleteDevicesAction.failed, (state: DeviceListStateType) => {
        return state.merge({
            devices: state.devices.merge({
                synchronizationStatus: SynchronizationStatus.failed
            })
        });
    })
    .case(clearDevicesAction, (state: DeviceListStateType) => {
        return state.merge({
            devices: state.devices.merge({
                payload: ImmutableMap<string, DeviceSummary>(),
                synchronizationStatus: SynchronizationStatus.deleted
            })
        }).set('deviceQuery', {
            clauses: [],
            continuationTokens: [],
            currentPageIndex: 0,
            deviceId: ''
        });
    });
export default reducer;
