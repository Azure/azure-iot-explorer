/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { Record, Map } from 'immutable';
import { IM } from '../../shared/types/types';
import { DeviceSummary } from './../../api/models/deviceSummary';
import DeviceQuery from '../../api/models/deviceQuery';
import { SynchronizationStatus } from '../../api/models/synchronizationStatus';
import { SynchronizationWrapper } from '../../api/models/SynchronizationWrapper';

export type DeviceList = Map<string, DeviceSummary>;

export interface DeviceListStateInterface {
    deviceQuery: DeviceQuery;
    devices: IM<SynchronizationWrapper<Map<string, DeviceSummary>>>;
}

export const deviceListStateInitial = Record<DeviceListStateInterface>({
    deviceQuery: {
        clauses: [],
        continuationTokens: [],
        currentPageIndex: 0,
        deviceId: '',
    },
    devices: Record({
        payload: Map<string, DeviceSummary>(),
        synchronizationStatus: SynchronizationStatus.initialized,
    })(),
});

export type DeviceListStateType = IM<DeviceListStateInterface>;
