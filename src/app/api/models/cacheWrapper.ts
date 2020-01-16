/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
export interface CacheWrapper<T> {
    payload: T;
    lastSynchronized: number;
}
