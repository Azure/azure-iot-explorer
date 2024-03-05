/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { reducerWithInitialState } from 'typescript-fsa-reducers';
import { deviceListStateInitial, DeviceListStateType } from './state';
import { listDevicesAction, deleteDevicesAction, ListDevicesActionParams } from './actions';
import { SynchronizationStatus } from '../../api/models/synchronizationStatus';
import { DeviceQuery } from '../../api/models/deviceQuery';
import { BulkRegistryOperationResult } from '../../api/models/bulkRegistryOperationResult';
import { DataPlaneResponse, Device } from '../../api/models/device';
import { transformDevice } from '../../api/dataTransforms/deviceSummaryTransform';
import { HEADERS } from '../../constants/apiConstants';

export const deviceListReducer = reducerWithInitialState<DeviceListStateType>(deviceListStateInitial())
    .case(listDevicesAction.started, (state: DeviceListStateType, payload: ListDevicesActionParams) => {
        return state.merge({
            deviceQuery: {...payload.query},
            synchronizationStatus: SynchronizationStatus.working
        });
    })
    // tslint:disable-next-line: cyclomatic-complexity
    .case(listDevicesAction.done, (state: DeviceListStateType, payload: {params: ListDevicesActionParams} & {result: DataPlaneResponse<Device[]>}) => {
        const devices = payload.result.body || [];
        const devicesummeries = devices.map(item => transformDevice(item));
        const continuationTokens = (state.deviceQuery.continuationTokens && [...state.deviceQuery.continuationTokens]) || [];
        const currentPageIndex = payload && payload.params && payload.params.query.currentPageIndex;

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
            devices: devicesummeries,
            synchronizationStatus: SynchronizationStatus.fetched,
        }).set('deviceQuery', {
            ...payload.params.query,
            continuationTokens,
            currentPageIndex
        });
    })
    .case(listDevicesAction.failed, (state: DeviceListStateType) => {
        return state.merge({
            devices: [],
            synchronizationStatus: SynchronizationStatus.failed,
        });
    })
    .case(deleteDevicesAction.started, (state: DeviceListStateType) => {
        return state.merge({
            synchronizationStatus: SynchronizationStatus.updating
        });
    })
    .case(deleteDevicesAction.done, (state: DeviceListStateType, payload: {params: string[]} & {result: BulkRegistryOperationResult}) => {
        const updatedDeviceList = state.devices.filter(item => !payload.params.includes(item.deviceId));

        return state.merge({
            deviceQuery: {
                clauses: [],
                continuationTokens: [],
                currentPageIndex: 0,
                deviceId: '',
            },
            devices: updatedDeviceList,
            synchronizationStatus: SynchronizationStatus.deleted
        });
    })
    .case(deleteDevicesAction.failed, (state: DeviceListStateType) => {
        return state.merge({
            synchronizationStatus: SynchronizationStatus.failed
        });
    });
