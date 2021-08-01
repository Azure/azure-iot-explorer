/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { Record } from 'immutable';
import { SynchronizationStatus } from '../../api/models/synchronizationStatus';
import { IM } from '../types/types';

export interface AuthenticationStateInterface {
    synchronizationStatus: SynchronizationStatus;
    token: string;
}

export type AuthenticationStateType = IM<AuthenticationStateInterface>;

export const authenticationStateInitial = Record<AuthenticationStateInterface>({
    synchronizationStatus: SynchronizationStatus.initialized,
    token: undefined
});
