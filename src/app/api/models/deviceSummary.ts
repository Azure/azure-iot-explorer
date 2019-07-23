/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { SynchronizationStatus } from './synchronizationStatus';

export interface DeviceSummary {
    deviceId: string;
    isEdgeDevice?: boolean;
    isPnpDevice: boolean;
    status: string;
    lastActivityTime: string;
    statusUpdatedTime: string;
    cloudToDeviceMessageCount: string;
    authenticationType: string;

    // Interfaces
    interfaceIds: string[];

    deviceSummarySynchronizationStatus: SynchronizationStatus;
}
