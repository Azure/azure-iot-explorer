/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import 'jest';
import { GET_DEVICE_IDENTITY, UPDATE_DEVICE_IDENTITY } from '../../constants/actionTypes';
import { getDeviceIdentityAction, updateDeviceIdentityAction } from './actions';
import { deviceContentReducer } from './reducer';
import { deviceContentStateInitial } from './state';
import { DeviceIdentity } from '../../api/models/deviceIdentity';
import { SynchronizationStatus } from '../../api/models/synchronizationStatus';

describe('deviceContentStateReducer', () => {
    const deviceId = 'testDeviceId';
    /* tslint:disable */
    const deviceIdentity: DeviceIdentity = {
        cloudToDeviceMessageCount: 0,
        deviceId,
        etag: 'AAAAAAAAAAk=',
        status: 'enabled',
        statusReason:null,
        statusUpdatedTime: '0001-01-01T00:00:00',
        lastActivityTime: '2019-04-22T22:49:58.4457783',
        capabilities: {
            iotEdge: false
        },
        authentication:{
            symmetricKey:{
                primaryKey: null,
                secondaryKey: null
            },
            x509Thumbprint:{
            primaryThumbprint:null,
            secondaryThumbprint:null},
            type: 'sas'
        },
    };
    /* tslint:enable */

    it (`handles ${GET_DEVICE_IDENTITY}/ACTION_START action`, () => {
        const action = getDeviceIdentityAction.started(deviceId);
        expect(deviceContentReducer(deviceContentStateInitial(), action).deviceIdentity.synchronizationStatus).toEqual(SynchronizationStatus.working);
    });

    it (`handles ${GET_DEVICE_IDENTITY}/ACTION_DONE action`, () => {
        const action = getDeviceIdentityAction.done({params: deviceId, result: deviceIdentity});
        expect(deviceContentReducer(deviceContentStateInitial(), action).deviceIdentity).toEqual({
            payload: deviceIdentity,
            synchronizationStatus: SynchronizationStatus.fetched});
    });

    it (`handles ${GET_DEVICE_IDENTITY}/ACTION_FAILED action`, () => {
        const action = getDeviceIdentityAction.failed({error: -1, params: deviceId});
        expect(deviceContentReducer(deviceContentStateInitial(), action).deviceIdentity.synchronizationStatus).toEqual(SynchronizationStatus.failed);
    });

    let initialState = deviceContentStateInitial();
    initialState = initialState.merge({
        deviceIdentity: {
            payload: deviceIdentity,
            synchronizationStatus: SynchronizationStatus.fetched
        }
    });
    deviceIdentity.cloudToDeviceMessageCount = 1;

    it (`handles ${UPDATE_DEVICE_IDENTITY}/ACTION_START action`, () => {
        const action = updateDeviceIdentityAction.started(deviceIdentity);
        expect(deviceContentReducer(initialState, action).deviceIdentity.synchronizationStatus).toEqual(SynchronizationStatus.updating);
    });

    it (`handles ${UPDATE_DEVICE_IDENTITY}/ACTION_DONE action`, () => {
        const action = updateDeviceIdentityAction.done({params: deviceIdentity, result: deviceIdentity});
        expect(deviceContentReducer(initialState, action).deviceIdentity).toEqual({
            payload: deviceIdentity,
            synchronizationStatus: SynchronizationStatus.upserted});
    });

    it (`handles ${UPDATE_DEVICE_IDENTITY}/ACTION_FAILED action`, () => {
        const action = updateDeviceIdentityAction.failed({error: -1, params: deviceIdentity});
        expect(deviceContentReducer(initialState, action).deviceIdentity.synchronizationStatus).toEqual(SynchronizationStatus.failed);
    });
});
