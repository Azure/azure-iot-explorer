/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { DeviceIdentity } from './deviceIdentity';
import { ErrorResponse } from './errorResponse';
import { SynchronizationStatus } from './synchronizationStatus';

export interface DeviceIdentityWrapper {
    deviceIdentity?: DeviceIdentity;
    deviceIdentitySynchronizationStatus: SynchronizationStatus;
    error?: ErrorResponse;
}
