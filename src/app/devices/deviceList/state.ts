/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { Record } from 'immutable';
import { IM } from '../../shared/types/types';
import { DeviceSummary } from './../../api/models/deviceSummary';
import DeviceQuery from '../../api/models/deviceQuery';
import { SynchronizationStatus } from '../../api/models/synchronizationStatus';

export interface DeviceListStateInterface {
    deviceQuery: DeviceQuery;
    devices: DeviceSummary[];
    synchronizationStatus: SynchronizationStatus;
}

export const deviceListStateInitial = Record<DeviceListStateInterface>({
    deviceQuery: {
        clauses: [],
        continuationTokens: [],
        currentPageIndex: 0,
        deviceId: '',
    },
    devices: [],
    synchronizationStatus: SynchronizationStatus.initialized,
});

export type DeviceListStateType = IM<DeviceListStateInterface>;
