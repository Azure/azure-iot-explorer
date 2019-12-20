/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { Action } from 'typescript-fsa';
import { call, put } from 'redux-saga/effects';
import { addNotificationAction } from '../../../notifications/actions';
import { NotificationType } from '../../../api/models/notification';
import { ResourceKeys } from '../../../../localization/resourceKeys';
import { listDevicesAction } from '../actions';
import { fetchDevices } from '../../../api/services/devicesService';
import DeviceQuery from '../../../api/models/deviceQuery';
import { getActiveAzureResourceConnectionStringSaga } from '../../../azureResource/sagas/getActiveAzureResourceConnectionStringSaga';

export function* listDevicesSaga(action: Action<DeviceQuery>) {
    try {
        const parameters = {
            connectionString: yield call(getActiveAzureResourceConnectionStringSaga),
            query: action.payload
        };
        const response = yield call(fetchDevices, parameters);
        yield put(listDevicesAction.done({params: action.payload, result: response}));
    } catch (error) {
        const text = error && error.message ? {
            translationKey: ResourceKeys.notifications.getDeviceListOnError,
            translationOptions: {
              error: error.message,
          },
        } :
        {
            translationKey: action.payload.clauses ? ResourceKeys.notifications.getDeviceListQueryGenericErrorHelp : ResourceKeys.notifications.getDeviceListGenericErrorHelp
        };
        yield put(addNotificationAction.started({
            text,
            type: NotificationType.error,
        }));

        yield put(listDevicesAction.failed({params: action.payload, error}));
    }
}
