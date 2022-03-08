/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { call, put, all, takeEvery } from 'redux-saga/effects';
import { SagaIterator } from 'redux-saga';
import { Action } from 'typescript-fsa';
import { monitorEvents } from '../../api/services/devicesService';
import { NotificationType } from '../../api/models/notification';
import { ResourceKeys } from '../../../localization/resourceKeys';
import { startEventsMonitoringAction } from './actions';
import { raiseNotificationToast } from '../../notifications/components/notificationToast';
import { MonitorEventsParameters } from '../../api/parameters/deviceParameters';

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

export function* EventMonitoringSaga() {
    yield all([
        takeEvery(startEventsMonitoringAction.started.type, startEventsMonitoringSagaWorker),
    ]);
}
