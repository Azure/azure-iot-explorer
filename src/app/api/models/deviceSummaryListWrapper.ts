/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { List, Map } from 'immutable';
import { ErrorResponse } from './errorResponse';
import { SynchronizationStatus } from './synchronizationStatus';

export interface DeviceSummaryListWrapper {
    deviceList?: List<Map<string, any>>; // tslint:disable-line:no-any
    deviceListSynchronizationStatus: SynchronizationStatus;
    error?: ErrorResponse;
}
