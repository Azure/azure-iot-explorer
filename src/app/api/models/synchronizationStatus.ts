/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/

/**
 * Synchronization status used for setting proper UI states.
 */
export enum SynchronizationStatus {
    deleted,
    fetched,
    initialized,
    upserted,
    working,
    failed,
    updating
}
