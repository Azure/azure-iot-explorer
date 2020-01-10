/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { Record, Map } from 'immutable';
import { IM } from '../../shared/types/types';
import { DeviceSummary } from './../../api/models/deviceSummary';
import DeviceQuery from '../../api/models/deviceQuery';
import { SynchronizationStatus } from '../../api/models/synchronizationStatus';
import { DeviceSummaryListWrapper } from '../../api/models/deviceSummaryListWrapper';

export interface DeviceListStateInterface {
    deviceQuery: DeviceQuery;
    devices: IM<DeviceSummaryListWrapper>;
}

export const deviceListStateInitial = Record<DeviceListStateInterface>({
    deviceQuery: {
        clauses: [],
        continuationTokens: [],
        currentPageIndex: 0,
        deviceId: '',
    },
    devices: Record({
        deviceList: Map<string, DeviceSummary>(),
        deviceListSynchronizationStatus: SynchronizationStatus.initialized,
    })(),
});

export type DeviceListStateType = IM<DeviceListStateInterface>;
