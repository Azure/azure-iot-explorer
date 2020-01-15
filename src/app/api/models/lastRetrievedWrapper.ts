/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
export interface LastRetrievedWrapper<T> {
    payload: T;
    lastRetrieved: string;
}
