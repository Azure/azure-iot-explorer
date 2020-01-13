/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { createSelector } from 'reselect';
import { DeviceList } from './state';
import { StateInterface } from '../../shared/redux/state';
import { DeviceSummary } from '../../api/models/deviceSummary';
import DeviceQuery from '../../api/models/deviceQuery';
import { SynchronizationWrapper } from '../../api/models/synchronizationWrapper';

const getDeviceSummaryListSelector = (state: StateInterface): SynchronizationWrapper<DeviceList> => {
    return state &&
        state.deviceListState &&
        state.deviceListState.devices;
};

export const getDeviceSummaryListStatus = createSelector(
    getDeviceSummaryListSelector,
    deviceListWrapper => {
        return deviceListWrapper && deviceListWrapper.synchronizationStatus;
    }
);

export const getDeviceSummaryWrapper = (state: StateInterface, deviceId: string): DeviceSummary => {
    const devices = state &&
        state.deviceListState &&
        state.deviceListState.devices &&
        state.deviceListState.devices.payload;
    return devices && devices.get(deviceId);
};

export const deviceSummaryListWrapperNoPNPSelector = createSelector(
    getDeviceSummaryListSelector,
    deviceListWrapper => {
        return Array.from(deviceListWrapper && deviceListWrapper.payload && deviceListWrapper.payload.values()) || [];
    }
);

export const deviceQuerySelector = (state: StateInterface): DeviceQuery => {
    return state && state.deviceListState && state.deviceListState.deviceQuery;
};
