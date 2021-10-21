/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import 'jest';
import { Map as ImmutableMap, fromJS } from 'immutable';
import { listDevicesAction, deleteDevicesAction } from './actions';
import { deviceListReducer } from './reducer';
import { deviceListStateInitial } from './state';
import { SynchronizationStatus } from '../../api/models/synchronizationStatus';
import { DeviceSummary } from '../../api/models/deviceSummary';
import { Device, DataPlaneResponse } from '../../api/models/device';

describe('deviceListStateReducer', () => {
    const deviceId = 'testDeviceId';
    const deviceSummary: DeviceSummary = {
        authenticationType: 'sas',
        cloudToDeviceMessageCount: '0',
        connectionState: 'Connected',
        deviceId,
        iotEdge: false,
        lastActivityTime: null,
        modelId: 'moduleId',
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
        ModelId: 'moduleId',
        Status: 'Enabled',
        StatusUpdatedTime: null,
    };

    it(`handles LIST_DEVICES/ACTION_START action`, () => {
        const action = listDevicesAction.started(undefined);
        expect(deviceListReducer(deviceListStateInitial(), action).devices).toEqual([]);
        expect(deviceListReducer(deviceListStateInitial(), action).synchronizationStatus).toEqual(SynchronizationStatus.working);
    });

    context('it has continuation tokens', () => {
        it(`handles LIST_DEVICES/ACTION_DONE action`, () => {
            const result: DataPlaneResponse<Device[]> = {
                body: [deviceObject],
                headers: { 'x-ms-continuation': 'abc123' }
            };

            const action = listDevicesAction.done({ params: undefined, result });
            const reduced = deviceListReducer(deviceListStateInitial(), action);
            expect(reduced.devices).toEqual([deviceSummary]);
            expect(reduced.synchronizationStatus).toEqual(SynchronizationStatus.fetched);
            expect(reduced.deviceQuery.continuationTokens).toEqual(['', 'abc123']);
        });
    });
    context('it has no continuation tokens', () => {
        it(`handles LIST_DEVICES/ACTION_DONE action`, () => {
            const result: DataPlaneResponse<Device[]> = {
                body: [deviceObject],
                headers: null
            };

            const action = listDevicesAction.done({ params: undefined, result });
            const reduced = deviceListReducer(deviceListStateInitial(), action);
            expect(reduced.devices).toEqual([deviceSummary]);
            expect(reduced.synchronizationStatus).toEqual(SynchronizationStatus.fetched);
            expect(reduced.deviceQuery.continuationTokens).toEqual([]);
        });
    });
    context('it has an empty continuation token', () => {
        it(`handles LIST_DEVICES/ACTION_DONE action`, () => {
            const result: DataPlaneResponse<Device[]> = {
                body: [deviceObject],
                headers: { 'x-ms-continuation': '' }
            };

            const action = listDevicesAction.done({ params: undefined, result });
            const reduced = deviceListReducer(deviceListStateInitial(), action);
            expect(reduced.devices).toEqual([deviceSummary]);
            expect(reduced.synchronizationStatus).toEqual(SynchronizationStatus.fetched);
            expect(reduced.deviceQuery.continuationTokens).toEqual([]);
        });
    });

    it(`handles LIST_DEVICES/ACTION_FAIL action`, () => {
        const action = listDevicesAction.failed(undefined);
        expect(deviceListReducer(deviceListStateInitial(), action).devices).toEqual([]);
        expect(deviceListReducer(deviceListStateInitial(), action).synchronizationStatus).toEqual(SynchronizationStatus.failed);
    });

    it(`handles DELETE_DEVICES/ACTION_START action`, () => {
        const action = deleteDevicesAction.started(undefined);
        expect(deviceListReducer(deviceListStateInitial(), action).synchronizationStatus).toEqual(SynchronizationStatus.updating);
    });

    it(`handles DELETE_DEVICES/ACTION_DONE action`, () => {
        const action = deleteDevicesAction.done({ params: [deviceId], result: undefined });
        const deviceSummaryMap = ImmutableMap<string, DeviceSummary>();
        expect(deviceListReducer(deviceListStateInitial(), action).devices).toEqual([]);
        expect(deviceListReducer(deviceListStateInitial(), action).synchronizationStatus).toEqual(SynchronizationStatus.deleted);
    });

    it(`handles DELETE_DEVICES/ACTION_FAIL action`, () => {
        const action = deleteDevicesAction.failed(undefined);
        expect(deviceListReducer(deviceListStateInitial(), action).synchronizationStatus).toEqual(SynchronizationStatus.failed);
    });
});
