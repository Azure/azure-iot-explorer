/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { call, put, all, takeEvery, takeLatest, select } from 'redux-saga/effects';
import { SagaIterator } from 'redux-saga';
import { Action } from 'typescript-fsa';
import { Type } from 'protobufjs';
import { monitorEvents, parseEvents, stopMonitoringEvents } from '../../api/services/devicesService';
import { NotificationType } from '../../api/models/notification';
import { ResourceKeys } from '../../../localization/resourceKeys';
import { setDecoderInfoAction, setEventsMessagesAction, startEventsMonitoringAction, stopEventsMonitoringAction } from './actions';
import { raiseNotificationToast } from '../../notifications/components/notificationToast';
import { MonitorEventsParameters, SetDecoderInfoParameters } from '../../api/parameters/deviceParameters';
import { setDecoderInfo } from './utils';
import { Message } from '../../api/models/messages';

export function* setEventsSagaWorker(action: Action<Message[]>): SagaIterator {
    try {
        const state = yield select();
        const result = yield call(parseEvents, {messages: action.payload, decoderPrototype: state.contentType.decoderPrototype});
        yield put(setEventsMessagesAction.done({params: action.payload, result}));
    } catch (error) {
        yield put(setEventsMessagesAction.failed({params: action.payload, error}));
    }
}

export function* startEventsMonitoringSagaWorker(action: Action<MonitorEventsParameters>): SagaIterator {
    try {
        yield call(monitorEvents, action.payload);
        yield put(startEventsMonitoringAction.done({params: action.payload}));
    } catch (error) {
        yield call(raiseNotificationToast, {
            text: {
                translationKey: ResourceKeys.notifications.startEventMonitoringOnError,
                translationOptions: {
                    error,
                },
            },
            type: NotificationType.error
          });
        yield put(startEventsMonitoringAction.failed({params: action.payload, error}));
    }
}

export function* stopEventsMonitoringSagaWorker() {
    try {
        yield call(stopMonitoringEvents);
        yield put(stopEventsMonitoringAction.done({}));
    } catch (error) {
        yield call(raiseNotificationToast, {
            text: {
                translationKey: ResourceKeys.notifications.stopEventMonitoringOnError,
                translationOptions: {
                    error,
                },
            },
            type: NotificationType.error
          });
        yield put(stopEventsMonitoringAction.failed({error}));
    }
}

export function* setDecoderInfoSagaWorker(action: Action<SetDecoderInfoParameters>): SagaIterator {
    try {
        const prototype: Type = yield call(setDecoderInfo, action.payload);
        yield put(setDecoderInfoAction.done({params: action.payload, result: {decodeType: action.payload.decodeType, decoderProtoFile: action.payload.decoderFile, decoderPrototype: prototype}}));
    } catch (error) {
        yield call(raiseNotificationToast, {
            text: {
                translationKey: ResourceKeys.notifications.updateCustomDecoderOnError,
                translationOptions: {
                    error: error.message,
                },
            },
            type: NotificationType.error
          });
        yield put(setDecoderInfoAction.failed({params: action.payload, error}));
    }
}

export function* EventMonitoringSaga() {
    yield all([
        takeEvery(startEventsMonitoringAction.started, startEventsMonitoringSagaWorker),
        takeLatest(stopEventsMonitoringAction.started, stopEventsMonitoringSagaWorker),
        takeLatest(setDecoderInfoAction.started, setDecoderInfoSagaWorker),
        takeEvery(setEventsMessagesAction.started, setEventsSagaWorker)
    ]);
}
