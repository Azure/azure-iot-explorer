/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { Record } from 'immutable';
import { SynchronizationStatus } from '../../../api/models/synchronizationStatus';
import { AddDeviceStateInterface } from '../../addDevice/state';
import { IM } from '../../../shared/types/types';

export interface AddModuleStateInterface {
    synchronizationStatus: SynchronizationStatus;
}

export const addModuleStateInitial = Record<AddDeviceStateInterface>({
    synchronizationStatus: SynchronizationStatus.initialized
});

export type AddModuleStateType = IM<AddModuleStateInterface>;
