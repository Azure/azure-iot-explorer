/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import 'jest';
import { START_EVENTS_MONITORING, STOP_EVENTS_MONITORING } from '../../constants/actionTypes';
import { startEventsMonitoringAction, stopEventsMonitoringAction } from './actions';
import { deviceEventsReducer } from './reducers';
import { deviceEventsStateInitial } from './state';
import { SynchronizationStatus } from '../../api/models/synchronizationStatus';
import { DEFAULT_CONSUMER_GROUP } from './../../constants/apiConstants';

describe('deviceEventsReducer', () => {
    const deviceId = 'testDeviceId';
    const params = {consumerGroup: DEFAULT_CONSUMER_GROUP, deviceId, moduleId:undefined, startTime: new Date()};
    const events = [{
        body: {
            humid: '123' // intentionally set a value which type is double
        },
        enqueuedTime: '2019-10-14T21:44:58.397Z',
        systemProperties: {
        'iothub-message-schema': 'humid'
        }
    }];
    it (`handles ${START_EVENTS_MONITORING}/ACTION_START action`, () => {
        const action = startEventsMonitoringAction.started(params);
        expect(deviceEventsReducer(deviceEventsStateInitial(), action).synchronizationStatus).toEqual(SynchronizationStatus.working);
    });

    it (`handles ${START_EVENTS_MONITORING}/ACTION_DONE action`, () => {
        const action = startEventsMonitoringAction.done({params, result: events});
        expect(deviceEventsReducer(deviceEventsStateInitial(), action).payload).toEqual(events);
        expect(deviceEventsReducer(deviceEventsStateInitial(), action).synchronizationStatus).toEqual(SynchronizationStatus.fetched);
    });

    it (`handles ${START_EVENTS_MONITORING}/ACTION_FAILED action`, () => {
        const action = startEventsMonitoringAction.failed({error: -1, params});
        expect(deviceEventsReducer(deviceEventsStateInitial(), action).synchronizationStatus).toEqual(SynchronizationStatus.failed);
    });

    let initialState = deviceEventsStateInitial();
    initialState = initialState.merge({
        payload: events,
        synchronizationStatus: SynchronizationStatus.fetched
    });

    it (`handles ${STOP_EVENTS_MONITORING}/ACTION_START action`, () => {
        const action = stopEventsMonitoringAction.started();
        expect(deviceEventsReducer(deviceEventsStateInitial(), action).synchronizationStatus).toEqual(SynchronizationStatus.updating);
        expect(deviceEventsReducer(deviceEventsStateInitial(), action).payload).toEqual([]);
    });

    it (`handles ${STOP_EVENTS_MONITORING}/ACTION_DONE action`, () => {
        const action = stopEventsMonitoringAction.done({});
        expect(deviceEventsReducer(deviceEventsStateInitial(), action).synchronizationStatus).toEqual(SynchronizationStatus.upserted);
        expect(deviceEventsReducer(deviceEventsStateInitial(), action).payload).toEqual([]);
    });

    it (`handles ${STOP_EVENTS_MONITORING}/ACTION_FAILED action`, () => {
        const action = stopEventsMonitoringAction.failed({error: -1});
        expect(deviceEventsReducer(deviceEventsStateInitial(), action).synchronizationStatus).toEqual(SynchronizationStatus.failed);
        expect(deviceEventsReducer(deviceEventsStateInitial(), action).payload).toEqual([]);
    });
});
