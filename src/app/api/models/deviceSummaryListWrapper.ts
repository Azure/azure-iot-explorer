/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { Map } from 'immutable';
import { SynchronizationStatus } from './synchronizationStatus';
import { DeviceSummary } from './deviceSummary';

export interface DeviceSummaryListWrapper {
    deviceList?: Map<string, DeviceSummary>;
    deviceListSynchronizationStatus: SynchronizationStatus;
}
