/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { SynchronizationStatus } from './synchronizationStatus';
export interface SynchronizationWrapper<T> {
    payload?: T;
    synchronizationStatus: SynchronizationStatus;
}
