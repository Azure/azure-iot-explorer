/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { Record } from 'immutable';
import { IM } from '../shared/types/types';
import { SynchronizationWrapper } from '../api/models/synchronizationWrapper';
import { SynchronizationStatus } from '../api/models/synchronizationStatus';

export interface ConnectionStringsStateInterface extends SynchronizationWrapper<ConnectionStringWithExpiry[]>{}

export type ConnectionStringsStateType = IM<ConnectionStringsStateInterface>;

export interface ConnectionStringWithExpiry {
    connectionString: string;
    expiration: string;
}

export const connectionStringsStateInitial = Record<ConnectionStringsStateInterface>({
    payload: [],
    synchronizationStatus: SynchronizationStatus.initialized
});
