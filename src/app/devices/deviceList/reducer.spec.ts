/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import 'jest';
import { Record, Map, List, fromJS } from 'immutable';
import { LIST_DEVICES, CLEAR_DEVICES } from '../../constants/actionTypes';
import { clearDevicesAction, listDevicesAction } from './actions';
import reducer from './reducer';
import { DeviceListStateInterface, deviceListStateInitial } from './state';
import { SynchronizationStatus } from '../../api/models/synchronizationStatus';
import { DeviceSummary } from '../../api/models/deviceSummary';
import { DeviceSummaryListWrapper } from '../../api/models/deviceSummaryListWrapper';

describe('deviceListStateReducer', () => {
    const deviceSummary: DeviceSummary = {
        authenticationType: 'sas',
        cloudToDeviceMessageCount: '0',
        deviceId: 'testDeviceId',
        deviceSummarySynchronizationStatus: SynchronizationStatus.initialized,
        interfaceIds: [],
        isPnpDevice: false,
        lastActivityTime: 'Thu Apr 25 2019 16:48:19 GMT-0700 (Pacific Daylight Time)',
        status: 'Enabled',
        statusUpdatedTime: 'Thu Apr 25 2019 16:48:19 GMT-0700 (Pacific Daylight Time)',
    };
    const deviceSummaryMap: Map<string, any> = fromJS(deviceSummary); // tslint:disable-line:no-any
    it (`handles ${LIST_DEVICES}/ACTION_DONE action`, () => {
        const action = listDevicesAction.done({params: undefined, result: [deviceSummary]});
        expect(reducer(deviceListStateInitial(), action).devices.deviceList).toEqual(List([deviceSummaryMap]));
    });

    it (`handles ${CLEAR_DEVICES} action`, () => {
        const initialState = Record<DeviceListStateInterface>({
            deviceQuery: null,
            devices: Record<DeviceSummaryListWrapper>({
                deviceList: List(),
                deviceListSynchronizationStatus: SynchronizationStatus.working
            })(),
        });
        const action = clearDevicesAction();
        expect(reducer(initialState(), action).devices.deviceList).toEqual(List([]));
    });
});
