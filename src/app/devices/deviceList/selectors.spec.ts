/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import 'jest';
import { Record, Map } from 'immutable';
import { SynchronizationStatus } from './../../api/models/synchronizationStatus';
import { getDeviceSummaryListStatus, getDeviceSummaryWrapper, deviceSummaryListWrapperNoPNPSelector } from './selectors';
import { getInitialState } from './../../api/shared/testHelper';
import { DeviceSummary } from '../../api/models/deviceSummary';

describe('getDigitalTwinInterfacePropertiesSelector', () => {
    const state = getInitialState();
    const deviceId = 'testDeviceId';
    const deviceSummary: DeviceSummary = {
        authenticationType: 'sas',
        cloudToDeviceMessageCount: '0',
        deviceId,
        lastActivityTime: 'Thu Apr 25 2019 16:48:19 GMT-0700 (Pacific Daylight Time)',
        status: 'Enabled',
        statusUpdatedTime: 'Thu Apr 25 2019 16:48:19 GMT-0700 (Pacific Daylight Time)',
    };
    const deviceSummaryMap = Map<string, DeviceSummary>();
    const newMap = deviceSummaryMap.set(deviceId, deviceSummary);
    state.deviceListState = Record({
        deviceQuery: undefined,
        devices: Record({
            payload: newMap,
            synchronizationStatus: SynchronizationStatus.fetched
        })()
    })();

    it('returns device list status', () => {
        expect(getDeviceSummaryListStatus(state)).toEqual(SynchronizationStatus.fetched);
    });

    it('returns device summary', () => {
        expect(getDeviceSummaryWrapper(state, deviceId)).toEqual(deviceSummary);
    });

    it('returns device summary list', () => {
        expect(deviceSummaryListWrapperNoPNPSelector(state)).toEqual([deviceSummary]);
    });
});
