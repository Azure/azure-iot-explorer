/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { SynchronizationStatus } from './../../../../api/models/synchronizationStatus';
import { Twin } from './../../../../api/models/device';
import { StateInterface } from '../../../../shared/redux/state';

export const getDeviceTwinSelector = (state: StateInterface): Twin => {
    return state &&
    state.deviceContentState &&
    state.deviceContentState.deviceTwin &&
    state.deviceContentState.deviceTwin.payload;
};

export const getDeviceTwinStateSelector = (state: StateInterface): SynchronizationStatus => {
    return state &&
    state.deviceContentState &&
    state.deviceContentState.deviceTwin &&
    state.deviceContentState.deviceTwin.synchronizationStatus;
};
