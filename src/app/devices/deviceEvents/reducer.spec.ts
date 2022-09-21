/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import 'jest';
import { SET_DECODE_INFO, START_EVENTS_MONITORING, STOP_EVENTS_MONITORING } from '../../constants/actionTypes';
import { setDecoderInfoAction, startEventsMonitoringAction, stopEventsMonitoringAction } from './actions';
import { deviceEventsReducer } from './reducers';
import { getInitialDeviceEventsState } from './state';
import { DEFAULT_CONSUMER_GROUP } from './../../constants/apiConstants';
import { Type } from 'protobufjs';

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
    const decoderParams = {decoderFile: new File([], ''), decoderType: 'decoderType', isDecoderCustomized: true};
    it (`handles ${START_EVENTS_MONITORING}/ACTION_START action`, () => {
        const action = startEventsMonitoringAction.started(params);
        expect(deviceEventsReducer(getInitialDeviceEventsState(), action).formMode).toEqual('working');
    });

    it (`handles ${START_EVENTS_MONITORING}/ACTION_DONE action`, () => {
        const action = startEventsMonitoringAction.done({params, result: events});
        expect(deviceEventsReducer(getInitialDeviceEventsState(), action).message).toEqual(events);
        expect(deviceEventsReducer(getInitialDeviceEventsState(), action).formMode).toEqual('fetched');
    });

    it (`handles ${START_EVENTS_MONITORING}/ACTION_FAILED action`, () => {
        const action = startEventsMonitoringAction.failed({error: -1, params});
        expect(deviceEventsReducer(getInitialDeviceEventsState(), action).formMode).toEqual('failed');
    });

    it (`handles ${STOP_EVENTS_MONITORING}/ACTION_START action`, () => {
        const action = stopEventsMonitoringAction.started();
        expect(deviceEventsReducer(getInitialDeviceEventsState(), action).formMode).toEqual('updating');
        expect(deviceEventsReducer(getInitialDeviceEventsState(), action).message).toEqual([]);
    });

    it (`handles ${STOP_EVENTS_MONITORING}/ACTION_DONE action`, () => {
        const action = stopEventsMonitoringAction.done({});
        expect(deviceEventsReducer(getInitialDeviceEventsState(), action).formMode).toEqual('upserted');
        expect(deviceEventsReducer(getInitialDeviceEventsState(), action).message).toEqual([]);
    });

    it (`handles ${STOP_EVENTS_MONITORING}/ACTION_FAILED action`, () => {
        const action = stopEventsMonitoringAction.failed({error: -1});
        expect(deviceEventsReducer(getInitialDeviceEventsState(), action).formMode).toEqual('failed');
        expect(deviceEventsReducer(getInitialDeviceEventsState(), action).message).toEqual([]);
    });

    it (`handles ${SET_DECODE_INFO}/ACTION_START action`, () => {
        const action = setDecoderInfoAction.started(decoderParams);
        expect(deviceEventsReducer(getInitialDeviceEventsState(), action).formMode).toEqual('working');
    });

    it (`handles ${SET_DECODE_INFO}/ACTION_DONE action`, () => {
        const action = setDecoderInfoAction.done({params: decoderParams, result: {isDecoderCustomized: true, decoderProtoFile: new File([], ''), decoderPrototype: new Type('')}});
        expect(deviceEventsReducer(getInitialDeviceEventsState(), action).formMode).toEqual('setDecoderSucceeded');
    });

    it (`handles ${SET_DECODE_INFO}/ACTION_FAILED action`, () => {
        const action = setDecoderInfoAction.failed({params: decoderParams, error: {}});
        expect(deviceEventsReducer(getInitialDeviceEventsState(), action).formMode).toEqual('setDecoderFailed');
    });
});
