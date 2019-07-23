/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { DigitalTwinInterfaces } from './digitalTwinModels';
import { ErrorResponse } from './errorResponse';
import { SynchronizationStatus } from './synchronizationStatus';

export interface DigitalTwinInterfacePropertiesWrapper {
    digitalTwinInterfaceProperties?: DigitalTwinInterfaces;
    digitalTwinInterfacePropertiesSyncStatus: SynchronizationStatus;
    error?: ErrorResponse;
}
