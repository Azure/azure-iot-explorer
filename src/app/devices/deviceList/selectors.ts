/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { Map } from 'immutable';
import { createSelector } from 'reselect';
import { StateType } from '../../shared/redux/state';
import { DeviceSummaryListWrapper } from '../../api/models/deviceSummaryListWrapper';
import { DeviceSummary } from '../../api/models/deviceSummary';
import { IM } from '../../shared/types/types';

export const getDeviceSummaryListWrapper = (state: StateType): IM<DeviceSummaryListWrapper> => {
    return state &&
    state.deviceListState &&
    state.deviceListState.devices;
};

export const getDeviceSummaryWrapper = (state: StateType, deviceId: string): DeviceSummary => {
    const devices = getDeviceSummaryListWrapper(state);
    const mapDevice = devices.deviceList && devices.deviceList.find((item: Map<any, any>) => { // tslint:disable-line
        return item.get('deviceId') === deviceId;
    });
    return mapDevice.toJS() as DeviceSummary;
};

export const deviceSummaryListWrapperSelector = createSelector(
    getDeviceSummaryListWrapper,
    deviceList => {
        return deviceList && deviceList.deviceList ? deviceList.deviceList.toJS() : [];
    }
);

export const deviceSummaryListWrapperNoPNPSelector = createSelector(
    getDeviceSummaryListWrapper,
    deviceList => {
        const devicesOnly = deviceList && deviceList.deviceList && deviceList.deviceList.map((device: Map<any, any>) => { // tslint:disable-line
            return device.remove('interfaceIds').remove('deviceSummarySynchronizationStatus').remove('isPnpDevice');
        });
        return !!devicesOnly ? devicesOnly.toJS() : [];
    }
);
