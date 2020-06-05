/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { DeviceIdentity } from '../../api/models/deviceIdentity';
import { SynchronizationWrapper } from '../../api/models/synchronizationWrapper';
import { StateInterface } from '../../shared/redux/state';

export const getDeviceIdentityWrapperSelector = (state: StateInterface): SynchronizationWrapper<DeviceIdentity> => {
    return state &&
        state.deviceContentState &&
        state.deviceContentState.deviceIdentity;
};
