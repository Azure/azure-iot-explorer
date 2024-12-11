/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import 'jest';
import { SET_DECODE_INFO, SET_DEFAULT_DECODE_INFO, SET_EVENTS_MESSAGES, START_EVENTS_MONITORING, STOP_EVENTS_MONITORING } from '../../constants/actionTypes';
import { setDecoderInfoAction, setDefaultDecodeInfoAction, setEventsMessagesAction, startEventsMonitoringAction, stopEventsMonitoringAction } from './actions';
import { deviceEventsReducer } from './reducers';
import { getInitialDeviceEventsState } from './state';
import { DEFAULT_CONSUMER_GROUP } from './../../constants/apiConstants';
import { Type } from 'protobufjs';

describe('deviceEventsReducer', () => {
    const deviceId = 'testDeviceId';
    const params = {consumerGroup: DEFAULT_CONSUMER_GROUP, deviceId, moduleId:''};
    const events = [{
        body: {
            humid: '123' // intentionally set a value which type is double
        },
        enqueuedTime: '2019-10-14T21:44:58.397Z',
        systemProperties: {
        'iothub-message-schema': 'humid'
        }
    }];
    const decoderParams = {decoderFile: new File([], ''), decoderPrototype: 'decoderPrototype', decodeType: 'Protobuf'};

    it (`handles ${START_EVENTS_MONITORING}/ACTION_START action`, () => {
        const action = startEventsMonitoringAction.started(params);
        expect(deviceEventsReducer(getInitialDeviceEventsState(), action).formMode).toEqual('working');
    });

    it (`handles ${START_EVENTS_MONITORING}/ACTION_DONE action`, () => {
        const action = startEventsMonitoringAction.done({params});
        expect(deviceEventsReducer(getInitialDeviceEventsState(), action).formMode).toEqual('fetched');
    });

    it (`handles ${START_EVENTS_MONITORING}/ACTION_FAILED action`, () => {
        const action = startEventsMonitoringAction.failed({error: -1, params});
        expect(deviceEventsReducer(getInitialDeviceEventsState(), action).formMode).toEqual('failed');
    });

    it (`handles ${STOP_EVENTS_MONITORING}/ACTION_START action`, () => {
        const action = stopEventsMonitoringAction.started();
        expect(deviceEventsReducer(getInitialDeviceEventsState(), action).formMode).toEqual('updating');
    });

    it (`handles ${STOP_EVENTS_MONITORING}/ACTION_DONE action`, () => {
        const action = stopEventsMonitoringAction.done({});
        expect(deviceEventsReducer(getInitialDeviceEventsState(), action).formMode).toEqual('upserted');
    });

    it (`handles ${STOP_EVENTS_MONITORING}/ACTION_FAILED action`, () => {
        const action = stopEventsMonitoringAction.failed({error: -1});
        expect(deviceEventsReducer(getInitialDeviceEventsState(), action).formMode).toEqual('failed');
    });

    it (`handles ${SET_DECODE_INFO}/ACTION_START action`, () => {
        const action = setDecoderInfoAction.started(decoderParams);
        expect(deviceEventsReducer(getInitialDeviceEventsState(), action).formMode).toEqual('working');
    });

    it (`handles ${SET_DECODE_INFO}/ACTION_DONE action`, () => {
        const action = setDecoderInfoAction.done({params: decoderParams, result: {decodeType: 'Protobuf', decoderProtoFile: new File([], ''), decoderPrototype: new Type('')}});
        expect(deviceEventsReducer(getInitialDeviceEventsState(), action).formMode).toEqual('setDecoderSucceeded');
    });

    it (`handles ${SET_DECODE_INFO}/ACTION_FAILED action`, () => {
        const action = setDecoderInfoAction.failed({params: decoderParams, error: {}});
        expect(deviceEventsReducer(getInitialDeviceEventsState(), action).formMode).toEqual('setDecoderFailed');
    });

    it (`handles ${SET_DEFAULT_DECODE_INFO} action`, () => {
        const action = setDefaultDecodeInfoAction();
        expect(deviceEventsReducer(getInitialDeviceEventsState(), action).contentType.decodeType).toEqual('JSON');
    });

    it (`handles ${SET_EVENTS_MESSAGES}/ACTION_START action`, () => {
        const action = setEventsMessagesAction.started(events);
        expect(deviceEventsReducer(getInitialDeviceEventsState(), action).formMode).toEqual('working');
        expect(deviceEventsReducer(getInitialDeviceEventsState(), action).message).toEqual([]);
    });

    it (`handles ${SET_EVENTS_MESSAGES}/ACTION_DONE action`, () => {
        const action = setEventsMessagesAction.done({params: events, result: events});
        expect(deviceEventsReducer(getInitialDeviceEventsState(), action).formMode).toEqual('fetched');
        expect(deviceEventsReducer(getInitialDeviceEventsState(), action).message).toEqual(events);
    });

    it (`handles ${SET_EVENTS_MESSAGES}/ACTION_FAILED action`, () => {
        const action = setEventsMessagesAction.failed({error: -1, params: events});
        expect(deviceEventsReducer(getInitialDeviceEventsState(), action).formMode).toEqual('failed');
        expect(deviceEventsReducer(getInitialDeviceEventsState(), action).message).toEqual([]);
    });
});
