/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { call, put, all, takeEvery, takeLatest } from 'redux-saga/effects';
import { SagaIterator } from 'redux-saga';
import { Action } from 'typescript-fsa';
import { Type } from 'protobufjs';
import { monitorEvents, stopMonitoringEvents } from '../../api/services/devicesService';
import { NotificationType } from '../../api/models/notification';
import { ResourceKeys } from '../../../localization/resourceKeys';
import { setDecoderInfoAction, setDecoderPrototypeAction, startEventsMonitoringAction, stopEventsMonitoringAction, validateDecoderInfoAction } from './actions';
import { raiseNotificationToast } from '../../notifications/components/notificationToast';
import { MonitorEventsParameters, SetDecoderInfoParameters, ValidateDecoderInfoParameters } from '../../api/parameters/deviceParameters';
import { validateDecoderInfo } from './utils';

export function* startEventsMonitoringSagaWorker(action: Action<MonitorEventsParameters>): SagaIterator {
    try {
        const messages = yield call(monitorEvents, action.payload);
        yield put(startEventsMonitoringAction.done({params: action.payload, result: messages}));
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

export function* validateDecoderInfoSagaWorker(action: Action<SetDecoderInfoParameters>) {
    try {
        const prototype: Type = yield call(validateDecoderInfo, action.payload);
        yield put(validateDecoderInfoAction({decoderFile: action.payload.decoderFile, decoderPrototype: prototype}));
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
    }
}

export function* EventMonitoringSaga() {
    yield all([
        takeEvery(startEventsMonitoringAction.started.type, startEventsMonitoringSagaWorker),
        takeLatest(stopEventsMonitoringAction.started.type, stopEventsMonitoringSagaWorker),
        takeLatest(setDecoderInfoAction, validateDecoderInfoSagaWorker)
    ]);
}
