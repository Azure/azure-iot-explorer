/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import 'jest';
import { Record, Map as ImmutableMap, fromJS } from 'immutable';
import { clearDevicesAction, listDevicesAction, addDeviceAction, deleteDevicesAction } from './actions';
import reducer from './reducer';
import { DeviceListStateInterface, deviceListStateInitial, DeviceList } from './state';
import { SynchronizationStatus } from '../../api/models/synchronizationStatus';
import { DeviceSummary } from '../../api/models/deviceSummary';
import { Device, DataPlaneResponse } from '../../api/models/device';
import { SynchronizationWrapper } from '../../api/models/SynchronizationWrapper';

describe('deviceListStateReducer', () => {
    const deviceId = 'testDeviceId';
    const deviceSummary: DeviceSummary = {
        authenticationType: 'sas',
        cloudToDeviceMessageCount: '0',
        connectionState: 'Connected',
        deviceId,
        iotEdge: false,
        lastActivityTime: null,
        status: 'Enabled',
        statusUpdatedTime: null,
    };
    const deviceObject: Device = {
        AuthenticationType: 'sas',
        CloudToDeviceMessageCount: '0',
        ConnectionState: 'Connected',
        DeviceId: deviceId,
        IotEdge: false,
        LastActivityTime: null,
        Status: 'Enabled',
        StatusUpdatedTime: null,
    };

    it(`handles LIST_DEVICES/ACTION_START action`, () => {
        const deviceSummaryMap = ImmutableMap<string, DeviceSummary>();
        const action = listDevicesAction.started(undefined);
        expect(reducer(deviceListStateInitial(), action).devices.payload).toEqual(deviceSummaryMap);
        expect(reducer(deviceListStateInitial(), action).devices.synchronizationStatus).toEqual(SynchronizationStatus.working);
    });

    context('it has continuation tokens', () => {
        it(`handles LIST_DEVICES/ACTION_DONE action`, () => {
            const deviceSummaryMap = new Map<string, DeviceSummary>();
            deviceSummaryMap.set(deviceId, deviceSummary);
            const result: DataPlaneResponse<Device[]> = {
                body: [deviceObject],
                headers: { 'x-ms-continuation': 'abc123' }
            };

            const action = listDevicesAction.done({ params: undefined, result });
            const reduced = reducer(deviceListStateInitial(), action);
            expect(reduced.devices.payload).toEqual(fromJS(deviceSummaryMap));
            expect(reduced.devices.synchronizationStatus).toEqual(SynchronizationStatus.fetched);
            expect(reduced.deviceQuery.continuationTokens).toEqual(['', 'abc123']);
        });
    });
    context('it has no continuation tokens', () => {
        it(`handles LIST_DEVICES/ACTION_DONE action`, () => {
            const deviceSummaryMap = new Map<string, DeviceSummary>();
            deviceSummaryMap.set(deviceId, deviceSummary);
            const result: DataPlaneResponse<Device[]> = {
                body: [deviceObject],
                headers: null
            };

            const action = listDevicesAction.done({ params: undefined, result });
            const reduced = reducer(deviceListStateInitial(), action);
            expect(reduced.devices.payload).toEqual(fromJS(deviceSummaryMap));
            expect(reduced.devices.synchronizationStatus).toEqual(SynchronizationStatus.fetched);
            expect(reduced.deviceQuery.continuationTokens).toEqual([]);
        });
    });
    context('it has an empty continuation token', () => {
        it(`handles LIST_DEVICES/ACTION_DONE action`, () => {
            const deviceSummaryMap = new Map<string, DeviceSummary>();
            deviceSummaryMap.set(deviceId, deviceSummary);
            const result: DataPlaneResponse<Device[]> = {
                body: [deviceObject],
                headers: { 'x-ms-continuation': '' }
            };

            const action = listDevicesAction.done({ params: undefined, result });
            const reduced = reducer(deviceListStateInitial(), action);
            expect(reduced.devices.payload).toEqual(fromJS(deviceSummaryMap));
            expect(reduced.devices.synchronizationStatus).toEqual(SynchronizationStatus.fetched);
            expect(reduced.deviceQuery.continuationTokens).toEqual([]);
        });
    });

    it(`handles LIST_DEVICES/ACTION_FAIL action`, () => {
        const deviceSummaryMap = ImmutableMap<string, DeviceSummary>();
        const action = listDevicesAction.failed(undefined);
        expect(reducer(deviceListStateInitial(), action).devices.payload).toEqual(deviceSummaryMap);
        expect(reducer(deviceListStateInitial(), action).devices.synchronizationStatus).toEqual(SynchronizationStatus.failed);
    });

    it(`handles ADD_DEVICE/ACTION_START action`, () => {
        const action = addDeviceAction.started(undefined);
        expect(reducer(deviceListStateInitial(), action).devices.synchronizationStatus).toEqual(SynchronizationStatus.updating);
    });

    it(`handles ADD_DEVICE/ACTION_DONE action`, () => {
        const action = addDeviceAction.done({ params: undefined, result: undefined });
        expect(reducer(deviceListStateInitial(), action).devices.synchronizationStatus).toEqual(SynchronizationStatus.upserted);
    });

    it(`handles ADD_DEVICE/ACTION_FAIL action`, () => {
        const action = addDeviceAction.failed(undefined);
        expect(reducer(deviceListStateInitial(), action).devices.synchronizationStatus).toEqual(SynchronizationStatus.failed);
    });

    it(`handles DELETE_DEVICES/ACTION_START action`, () => {
        const action = deleteDevicesAction.started(undefined);
        expect(reducer(deviceListStateInitial(), action).devices.synchronizationStatus).toEqual(SynchronizationStatus.updating);
    });

    it(`handles DELETE_DEVICES/ACTION_DONE action`, () => {
        const action = deleteDevicesAction.done({ params: [deviceId], result: undefined });
        const deviceSummaryMap = ImmutableMap<string, DeviceSummary>();
        expect(reducer(deviceListStateInitial(), action).devices.payload).toEqual(deviceSummaryMap);
        expect(reducer(deviceListStateInitial(), action).devices.synchronizationStatus).toEqual(SynchronizationStatus.deleted);
    });

    it(`handles DELETE_DEVICES/ACTION_FAIL action`, () => {
        const action = deleteDevicesAction.failed(undefined);
        expect(reducer(deviceListStateInitial(), action).devices.synchronizationStatus).toEqual(SynchronizationStatus.failed);
    });

    it(`handles CLEAR_DEVICES action`, () => {
        const initialState = Record<DeviceListStateInterface>({
            deviceQuery: null,
            devices: Record<SynchronizationWrapper<DeviceList>>({
                payload: ImmutableMap<string, DeviceSummary>(),
                synchronizationStatus: SynchronizationStatus.working
            })(),
        });
        const action = clearDevicesAction();
        expect(reducer(initialState(), action).devices.payload).toEqual(ImmutableMap<string, DeviceSummary>());
    });
});
