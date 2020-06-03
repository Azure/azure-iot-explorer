/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import 'jest';
// tslint:disable-next-line: no-submodule-imports
import { SagaIteratorClone, cloneableGenerator } from '@redux-saga/testing-utils';
import { call, put } from 'redux-saga/effects';
import { deleteDevicesSaga } from './deleteDeviceSaga';
import * as DevicesService from '../../../api/services/devicesService';
import { deleteDevicesAction } from '../actions';
import { getActiveAzureResourceConnectionStringSaga } from '../../../azureResource/sagas/getActiveAzureResourceConnectionStringSaga';
import { ResourceKeys } from '../../../../localization/resourceKeys';
import { NotificationType } from '../../../api/models/notification';
import { BulkRegistryOperationResult } from '../../../api/models/bulkRegistryOperationResult';
import { raiseNotificationToast } from '../../../notifications/components/notificationToast';

describe('deleteDeviceSaga', () => {
    let deleteDevicesSagaGenerator: SagaIteratorClone;

    const connectionString = 'connection_string';
    const deviceIds = [
        'device_id1',
        'device_id2',
        'device_id3'
    ];

    const mockResult: BulkRegistryOperationResult = {
        errors: [],
        isSuccessful: true,
        warnings: []
    };

    const mockDeleteDevice = jest.spyOn(DevicesService, 'deleteDevices').mockImplementationOnce(parameters => {
        return null;
    });

    beforeAll(() => {
        deleteDevicesSagaGenerator = cloneableGenerator(deleteDevicesSaga)(deleteDevicesAction.started(deviceIds));
    });

    it('deletes the devices', () => {
        expect(deleteDevicesSagaGenerator.next()).toEqual({
            done: false,
            value: call(mockDeleteDevice, {
                deviceIds
            })
        });
    });

    it('puts the successful action', () => {
        const success = deleteDevicesSagaGenerator.clone();
        expect(success.next(mockResult)).toEqual({
            done: false,
            value: call(raiseNotificationToast, {
                text: {
                    translationKey: ResourceKeys.notifications.deleteDeviceOnSucceed,
                    translationOptions: {
                        count: deviceIds.length
                    },
                },
                type: NotificationType.success
              })
        });

        expect(success.next()).toEqual({
            done: false,
            value: put(deleteDevicesAction.done({params: deviceIds, result: mockResult}))
        });

        expect(success.next().done).toEqual(true);
    });

    it('fails on error', () => {
        const failure = deleteDevicesSagaGenerator.clone();
        const error = { code: -1 };
        expect(failure.throw(error)).toEqual({
            done: false,
            value: call(raiseNotificationToast, {
                text: {
                    translationKey: ResourceKeys.notifications.deleteDeviceOnError,
                    translationOptions: {
                        count: deviceIds.length,
                        error,
                    },
                },
                type: NotificationType.error
              })
        });

        expect(failure.next(error)).toEqual({
            done: false,
            value: put(deleteDevicesAction.failed({params: deviceIds, error}))
        });
        expect(failure.next().done).toEqual(true);
    });
});
