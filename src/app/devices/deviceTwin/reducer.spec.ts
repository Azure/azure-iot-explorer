/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import 'jest';
import { Twin } from '../../api/models/device';
import { GET_TWIN, UPDATE_TWIN } from '../../constants/actionTypes';
import { getDeviceTwinAction, updateDeviceTwinAction } from './actions';
import { deviceTwinReducer } from './reducer';
import { deviceTwinStateInitial } from './state';
import { SynchronizationStatus } from '../../api/models/synchronizationStatus';

describe('deviceTwinReducer', () => {
    const deviceId = 'testDeviceId';

    /* tslint:disable */
    const result: Twin = {
        deviceId,
        etag: 'AAAAAAAAAAk=',
        deviceEtag: 'NTQ0MTQ4NzAy',
        status: 'enabled',
        lastActivityTime: '0001-01-01T00:00:00',
        statusUpdateTime: '0001-01-01T00:00:00',
        x509Thumbprint: {},
        version: 1,
        capabilities: {
            iotEdge: false
        },
        connectionState: 'Connected',
        cloudToDeviceMessageCount: 0,
        authenticationType: 'sas',
        properties: {
            desired: {
                'contoso*com^EnvironmentalSensor^1*0*0' : {
                    brightlevel: 1
                }
            },
            reported: {}
        }
    };
    /* tslint:enable */

    it (`handles ${GET_TWIN}/ACTION_START action`, () => {
        const action = getDeviceTwinAction.started(deviceId);
        expect(deviceTwinReducer(deviceTwinStateInitial(), action).deviceTwin.synchronizationStatus).toEqual(SynchronizationStatus.working);
    });

    it (`handles ${GET_TWIN}/ACTION_DONE action`, () => {
        const action = getDeviceTwinAction.done({params: deviceId, result});
        expect(deviceTwinReducer(deviceTwinStateInitial(), action).deviceTwin.synchronizationStatus).toEqual(SynchronizationStatus.fetched);
        expect(deviceTwinReducer(deviceTwinStateInitial(), action).deviceTwin.payload).toEqual(result);
    });

    it (`handles ${GET_TWIN}/ACTION_FAILED action`, () => {
        const action = getDeviceTwinAction.failed({error: -1, params: deviceId});
        expect(deviceTwinReducer(deviceTwinStateInitial(), action).deviceTwin.synchronizationStatus).toEqual(SynchronizationStatus.failed);
    });

    const fetchedState = deviceTwinStateInitial().merge({
        deviceTwin: {
            payload: result,
            synchronizationStatus: SynchronizationStatus.fetched
        }
    });

    it (`handles ${UPDATE_TWIN}/ACTION_START action`, () => {
        const action = updateDeviceTwinAction.started({
            deviceId,
            twin: result
        });
        expect(deviceTwinReducer(fetchedState, action).deviceTwin.synchronizationStatus).toEqual(SynchronizationStatus.updating);
    });

    it (`handles ${UPDATE_TWIN}/ACTION_DONE action`, () => {
        const action = updateDeviceTwinAction.done({params: {
            deviceId,
            twin: result
        }, result});
        expect(deviceTwinReducer(fetchedState, action).deviceTwin.payload).toEqual(result);
        expect(deviceTwinReducer(fetchedState, action).deviceTwin.synchronizationStatus).toEqual(SynchronizationStatus.upserted);
    });

    it (`handles ${UPDATE_TWIN}/ACTION_FAILED action`, () => {
        const action = updateDeviceTwinAction.failed({error: -1, params: {
            deviceId,
            twin: result
        }});
        expect(deviceTwinReducer(fetchedState, action).deviceTwin.synchronizationStatus).toEqual(SynchronizationStatus.failed);
    });
});
