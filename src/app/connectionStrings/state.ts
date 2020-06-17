/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { Record } from 'immutable';
import { CONNECTION_STRING_NAME_LIST } from '../constants/browserStorage';
import { IM } from '../shared/types/types';
import { SynchronizationWrapper } from '../api/models/synchronizationWrapper';
import { SynchronizationStatus } from '../api/models/synchronizationStatus';

export interface ConnectionStringsStateInterface extends SynchronizationWrapper<string[]>{}

export type ConnectionStringsStateType = IM<ConnectionStringsStateInterface>;

export const connectionStringsStateInitial = Record<ConnectionStringsStateInterface>({
    payload: localStorage.getItem(CONNECTION_STRING_NAME_LIST) && localStorage.getItem(CONNECTION_STRING_NAME_LIST).split(',') || [],
    synchronizationStatus: SynchronizationStatus.initialized
});
