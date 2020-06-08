/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { Record } from 'immutable';
import { IM } from '../../../shared/types/types';
import { DeviceIdentity } from '../../../api/models/deviceIdentity';
import { SynchronizationWrapper } from '../../../api/models/synchronizationWrapper';
import { SynchronizationStatus } from '../../../api/models/synchronizationStatus';

export interface DeviceIdentityStateInterface extends SynchronizationWrapper<DeviceIdentity>{}

export const deviceIdentityStateInitial = Record<DeviceIdentityStateInterface>({
    payload: null,
    synchronizationStatus: SynchronizationStatus.initialized
});

export type DeviceIdentityStateType = IM<DeviceIdentityStateInterface>;
