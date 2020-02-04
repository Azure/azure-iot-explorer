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
import { ERROR_TYPES } from './../../../api/constants';
import { appConfig } from '../../../../appConfig/appConfig';
import { CUSTOM_CONTROLLER_PORT } from './../../../constants/browserStorage';

export function* listDevicesSaga(action: Action<DeviceQuery>) {
    try {
        const parameters = {
            connectionString: yield call(getActiveAzureResourceConnectionStringSaga),
            query: action.payload
        };
        const response = yield call(fetchDevices, parameters);
        yield put(listDevicesAction.done({params: action.payload, result: response}));
    } catch (error) {
        let text;
        if (error && error.name === ERROR_TYPES.PORT_IS_IN_USE) {
            text = {
                translationKey: ResourceKeys.notifications.portIsInUseError,
                translationOptions: { portNumber: localStorage.getItem(CUSTOM_CONTROLLER_PORT) || appConfig.controllerPort }
            };
        }
        else if (error && error.message) {
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

        yield put(addNotificationAction.started({
            text,
            type: NotificationType.error,
        }));

        yield put(listDevicesAction.failed({params: action.payload, error}));
    }
}
