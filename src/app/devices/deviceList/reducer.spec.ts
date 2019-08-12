/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import 'jest';
import { Record, Map as ImmutableMap, fromJS } from 'immutable';
import { LIST_DEVICES, CLEAR_DEVICES, ADD_DEVICE, DELETE_DEVICES } from '../../constants/actionTypes';
import { clearDevicesAction, listDevicesAction, addDeviceAction, deleteDevicesAction } from './actions';
import reducer from './reducer';
import { DeviceListStateInterface, deviceListStateInitial } from './state';
import { SynchronizationStatus } from '../../api/models/synchronizationStatus';
import { DeviceSummary } from '../../api/models/deviceSummary';
import { DeviceSummaryListWrapper } from '../../api/models/deviceSummaryListWrapper';
import { Device, DataPlaneResponse } from '../../api/models/device';

describe('deviceListStateReducer', () => {
    const deviceId = 'testDeviceId';
    const deviceSummary: DeviceSummary = {
        authenticationType: 'sas',
        cloudToDeviceMessageCount: '0',
        deviceId,
        lastActivityTime: null,
        status: 'Enabled',
        statusUpdatedTime: null,
    };
    const deviceObject: Device = {
        AuthenticationType: 'sas',
        CloudToDeviceMessageCount: '0',
        DeviceId: deviceId,
        IotEdge: false,
        LastActivityTime: null,
        Status: 'Enabled',
        StatusUpdatedTime: null,
    };

    it (`handles ${LIST_DEVICES}/ACTION_START action`, () => {
        const deviceSummaryMap = ImmutableMap<string, DeviceSummary>();
        const action = listDevicesAction.started(undefined);
        expect(reducer(deviceListStateInitial(), action).devices.deviceList).toEqual(deviceSummaryMap);
        expect(reducer(deviceListStateInitial(), action).devices.deviceListSynchronizationStatus).toEqual(SynchronizationStatus.working);
    });

    it(`handles ${LIST_DEVICES}/ACTION_DONE action`, () => {
        const deviceSummaryMap = new Map<string, DeviceSummary>();
        deviceSummaryMap.set(deviceId, deviceSummary);
        const result: DataPlaneResponse<Device[]> = {
            body: [deviceObject],
            headers: {'x-ms-continuation': 'abc123'}
        };

        const action = listDevicesAction.done({params: undefined, result});
        const reduced = reducer(deviceListStateInitial(), action);
        expect(reduced.devices.deviceList).toEqual(fromJS(deviceSummaryMap));
        expect(reduced.devices.deviceListSynchronizationStatus).toEqual(SynchronizationStatus.fetched);
        expect(reduced.deviceQuery.continuationTokens).toEqual(['', 'abc123']);
    });

    it (`handles ${LIST_DEVICES}/ACTION_FAIL action`, () => {
        const deviceSummaryMap = ImmutableMap<string, DeviceSummary>();
        const action = listDevicesAction.failed(undefined);
        expect(reducer(deviceListStateInitial(), action).devices.deviceList).toEqual(deviceSummaryMap);
        expect(reducer(deviceListStateInitial(), action).devices.deviceListSynchronizationStatus).toEqual(SynchronizationStatus.failed);
    });

    it (`handles ${ADD_DEVICE}/ACTION_START action`, () => {
        const action = addDeviceAction.started(undefined);
        expect(reducer(deviceListStateInitial(), action).devices.deviceListSynchronizationStatus).toEqual(SynchronizationStatus.updating);
    });

    it (`handles ${ADD_DEVICE}/ACTION_DONE action`, () => {
        const action = addDeviceAction.done({params: undefined, result: deviceSummary});
        expect(reducer(deviceListStateInitial(), action).devices.deviceListSynchronizationStatus).toEqual(SynchronizationStatus.upserted);
    });

    it (`handles ${ADD_DEVICE}/ACTION_FAIL action`, () => {
        const action = addDeviceAction.failed(undefined);
        expect(reducer(deviceListStateInitial(), action).devices.deviceListSynchronizationStatus).toEqual(SynchronizationStatus.failed);
    });

    it (`handles ${DELETE_DEVICES}/ACTION_START action`, () => {
        const action = deleteDevicesAction.started(undefined);
        expect(reducer(deviceListStateInitial(), action).devices.deviceListSynchronizationStatus).toEqual(SynchronizationStatus.updating);
    });

    it (`handles ${DELETE_DEVICES}/ACTION_DONE action`, () => {
        const action = deleteDevicesAction.done({params: [deviceId], result: undefined});
        const deviceSummaryMap = ImmutableMap<string, DeviceSummary>();
        expect(reducer(deviceListStateInitial(), action).devices.deviceList).toEqual(deviceSummaryMap);
        expect(reducer(deviceListStateInitial(), action).devices.deviceListSynchronizationStatus).toEqual(SynchronizationStatus.deleted);
    });

    it (`handles ${DELETE_DEVICES}/ACTION_FAIL action`, () => {
        const action = deleteDevicesAction.failed(undefined);
        expect(reducer(deviceListStateInitial(), action).devices.deviceListSynchronizationStatus).toEqual(SynchronizationStatus.failed);
    });

    it (`handles ${CLEAR_DEVICES} action`, () => {
        const initialState = Record<DeviceListStateInterface>({
            deviceQuery: null,
            devices: Record<DeviceSummaryListWrapper>({
                deviceList: ImmutableMap<string, DeviceSummary>(),
                deviceListSynchronizationStatus: SynchronizationStatus.working
            })(),
        });
        const action = clearDevicesAction();
        expect(reducer(initialState(), action).devices.deviceList).toEqual(ImmutableMap<string, DeviceSummary>());
    });
});
