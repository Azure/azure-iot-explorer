/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import 'jest';
// tslint:disable-next-line: no-implicit-dependencies
import { SagaIteratorClone, cloneableGenerator } from '@redux-saga/testing-utils';
import { call, put } from 'redux-saga/effects';
import { listDevicesSaga } from './listDeviceSaga';
import DeviceQuery from '../../../api/models/deviceQuery';
import * as DevicesService from '../../../api/services/devicesService';
import { listDevicesAction } from '../actions';
import { getActiveAzureResourceConnectionStringSaga } from '../../../azureResource/sagas/getActiveAzureResourceConnectionStringSaga';
import { DeviceIdentity } from '../../../api/models/deviceIdentity';
import { ResourceKeys } from '../../../../localization/resourceKeys';
import { NotificationType } from '../../../api/models/notification';
import { ERROR_TYPES } from '../../../constants/apiConstants';
import { raiseNotificationToast } from '../../../notifications/components/notificationToast';

describe('listDeviceSaga', () => {
    let listDevicesSagaGenerator: SagaIteratorClone;

    const connectionString = 'connection_string';
    const deviceId = 'device_id';
    const mockDevices: DeviceIdentity[] = [
            {
            authentication: null,
            capabilities: null,
            cloudToDeviceMessageCount: 0,
            deviceId,
            etag: 'etag',
            lastActivityTime: '',
            status: 'Enabled',
            statusReason: '',
            statusUpdatedTime: ''
        }
    ];
    const query: DeviceQuery = {
        clauses: [],
        continuationTokens: [],
        currentPageIndex: 0,
        deviceId
    };

    const mockFetchDevices = jest.spyOn(DevicesService, 'fetchDevices').mockImplementationOnce(parameters => {
        return null;
    });

    beforeAll(() => {
        listDevicesSagaGenerator = cloneableGenerator(listDevicesSaga)(listDevicesAction.started(query));
    });

    it('fetches the devices', () => {
        expect(listDevicesSagaGenerator.next()).toEqual({
            done: false,
            value: call(mockFetchDevices, {
                query
            })
        });
    });

    it('puts the successful action', () => {
        const success = listDevicesSagaGenerator.clone();

        expect(success.next(mockDevices)).toEqual({
            done: false,
            value: put(listDevicesAction.done({params: query, result: mockDevices as any})) // tslint:disable-line:no-any
        });

        expect(success.next().done).toEqual(true);
    });

    it('fails on error', () => {
        const failure = listDevicesSagaGenerator.clone();
        const error = { message: 'failed' };
        expect(failure.throw(error)).toEqual({
            done: false,
            value: call(raiseNotificationToast, {
                text: {
                    translationKey: ResourceKeys.notifications.getDeviceListOnError,
                    translationOptions: {
                      error: error.message,
                  },
                },
                type: NotificationType.error,
            })
        });

        expect(failure.next(error)).toEqual({
            done: false,
            value: put(listDevicesAction.failed({params: query, error}))
        });
        expect(failure.next().done).toEqual(true);
    });

    it('fails on port in use error', () => {
        const failure = listDevicesSagaGenerator.clone();
        const error = { name: ERROR_TYPES.PORT_IS_IN_USE };
        expect(failure.throw(error)).toEqual({
            done: false,
            value: call(raiseNotificationToast, {
                text: {
                    translationKey: ResourceKeys.notifications.portIsInUseError,
                    translationOptions: {
                        portNumber: undefined,
                  },
                },
                type: NotificationType.error,
            })
        });

        expect(failure.next(error)).toEqual({
            done: false,
            value: put(listDevicesAction.failed({params: query, error}))
        });
        expect(failure.next().done).toEqual(true);
    });
});
