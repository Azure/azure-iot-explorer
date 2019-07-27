/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { createSelector } from 'reselect';
import { StateInterface } from '../../shared/redux/state';
import { DeviceSummaryListWrapper } from '../../api/models/deviceSummaryListWrapper';
import { DeviceSummary } from '../../api/models/deviceSummary';

const getDeviceSummaryListSelector = (state: StateInterface): DeviceSummaryListWrapper => {
    return state &&
        state.deviceListState &&
        state.deviceListState.devices;
};

export const getDeviceSummaryListStatus = createSelector(
    getDeviceSummaryListSelector,
    deviceListWrapper => {
        return deviceListWrapper && deviceListWrapper.deviceListSynchronizationStatus;
    }
);

export const getDeviceSummaryWrapper = (state: StateInterface, deviceId: string): DeviceSummary => {
    const devices = state &&
        state.deviceListState &&
        state.deviceListState.devices &&
        state.deviceListState.devices.deviceList;
    return devices && devices.get(deviceId);
};

export const deviceSummaryListWrapperNoPNPSelector = createSelector(
    getDeviceSummaryListSelector,
    deviceListWrapper => {
        return Array.from(deviceListWrapper && deviceListWrapper.deviceList && deviceListWrapper.deviceList.values()) || [];
    }
);
