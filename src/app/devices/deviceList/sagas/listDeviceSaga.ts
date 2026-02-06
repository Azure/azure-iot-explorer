/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { Action } from 'typescript-fsa';
import { SagaIterator } from 'redux-saga';
import { call, put } from 'redux-saga/effects';
import { raiseNotificationToast } from '../../../notifications/components/notificationToast';
import { NotificationType } from '../../../api/models/notification';
import { ResourceKeys } from '../../../../localization/resourceKeys';
import { listDevicesAction } from '../actions';
import { fetchDevices } from '../../../api/services/devicesService';
import { DeviceQuery } from '../../../api/models/deviceQuery';

export function* listDevicesSaga(action: Action<DeviceQuery>): SagaIterator {
    try {
        const parameters = {
            query: action.payload
        };
        const response = yield call(fetchDevices, parameters);
        yield put(listDevicesAction.done({params: action.payload, result: response}));
    } catch (error) {
        let text;
        if (error && error.message) {
            text = {
                translationKey: ResourceKeys.notifications.getDeviceListOnError,
                translationOptions: { error: error.message }
            };
        }
        else {
            // tslint:disable-next-line:cyclomatic-complexity
            text = {
                translationKey: ResourceKeys.notifications.getDeviceListGenericErrorHelp
            };
        }

        yield call(raiseNotificationToast, {
            text,
            type: NotificationType.error,
        });

        yield put(listDevicesAction.failed({params: action.payload, error}));
    }
}
