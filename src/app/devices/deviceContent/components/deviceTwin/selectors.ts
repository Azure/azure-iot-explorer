/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { SynchronizationStatus } from './../../../../api/models/synchronizationStatus';
import { Twin } from './../../../../api/models/device';
import { StateType } from '../../../../shared/redux/state';

export const getDeviceTwinSelector = (state: StateType): Twin => {
    return state &&
    state.deviceContentState &&
    state.deviceContentState.deviceTwin &&
    state.deviceContentState.deviceTwin.deviceTwin;
};

export const getDeviceTwinStateSelector = (state: StateType): SynchronizationStatus => {
    return state &&
    state.deviceContentState &&
    state.deviceContentState.deviceTwin &&
    state.deviceContentState.deviceTwin.deviceTwinSynchronizationStatus;
};
