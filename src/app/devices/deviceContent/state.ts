/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { Record } from 'immutable';
import { IM } from '../../shared/types/types';
import { DeviceIdentity } from '../../api/models/deviceIdentity';
import { SynchronizationWrapper } from '../../api/models/synchronizationWrapper';

export interface DeviceContentStateInterface {
    deviceIdentity: SynchronizationWrapper<DeviceIdentity>;
}

export const deviceContentStateInitial = Record<DeviceContentStateInterface>({
    deviceIdentity: null
});

export type DeviceContentStateType = IM<DeviceContentStateInterface>;
