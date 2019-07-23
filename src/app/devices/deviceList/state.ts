/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { Record, List } from 'immutable';
import { IM } from '../../shared/types/types';
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
        deviceId: '',
        nextLink: ''
    },
    devices: Record({
        deviceList: List([]),
        deviceListSynchronizationStatus: SynchronizationStatus.initialized,
        error: {
            error: {
                code: -1,
                message: ''
            },
            sourceId: '',
            traceIdentifier: ''
        }
    })(),
});

export type DeviceListStateType = IM<DeviceListStateInterface>;
