/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { Record } from 'immutable';
import { IM } from '../../shared/types/types';
import { SynchronizationWrapper } from '../../api/models/synchronizationWrapper';
import { Message } from '../../api/models/messages';
import { SynchronizationStatus } from '../../api/models/synchronizationStatus';

export interface DeviceEventsStateInterface extends SynchronizationWrapper<Message[]>{}

export const deviceEventsStateInitial = Record<DeviceEventsStateInterface>({
    payload: [],
    synchronizationStatus: SynchronizationStatus.initialized
});

export type DeviceEventsStateType = IM<DeviceEventsStateInterface>;
