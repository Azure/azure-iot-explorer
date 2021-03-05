/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import 'jest';
// tslint:disable-next-line: no-implicit-dependencies
import { SagaIteratorClone, cloneableGenerator } from '@redux-saga/testing-utils';
import { call, put } from 'redux-saga/effects';
import { updateDeviceTwinAction } from '../actions';
import * as DevicesService from '../../../api/services/devicesService';
import { Twin } from '../../../api/models/device';
import { raiseNotificationToast } from '../../../notifications/components/notificationToast';
import { ResourceKeys } from '../../../../localization/resourceKeys';
import { NotificationType } from '../../../api/models/notification';
import { updateDeviceTwinSaga } from './updateDeviceTwinSaga';

describe('updateDeviceTwinSaga', () => {
    let updateDeviceTwinSagaGenerator: SagaIteratorClone;

    const deviceId = 'device_id';

    const mockTwin: Twin = {
        authenticationType: 'SymmetricKey',
        capabilities: {
            iotEdge: false
        },
        cloudToDeviceMessageCount: 0,
        connectionState: 'Connected',
        deviceEtag: 'etag',
        deviceId,
        etag: 'etag',
        lastActivityTime: new Date().toUTCString(),
        properties: null,
        status: 'enabled',
        statusUpdateTime: new Date().toUTCString(),
        version: 1,
        x509Thumbprint: null
    };

    beforeAll(() => {
        updateDeviceTwinSagaGenerator = cloneableGenerator(updateDeviceTwinSaga)(updateDeviceTwinAction.started(mockTwin));
    });

    const mockUpdateDeviceTwin = jest.spyOn(DevicesService, 'updateDeviceTwin').mockImplementationOnce(parameters => {
        return null;
    });

    it('updates the device twin', () => {
        expect(updateDeviceTwinSagaGenerator.next()).toEqual({
            done: false,
            value: call(mockUpdateDeviceTwin, mockTwin)
        });
    });

    it('puts the successful action', () => {
        const success = updateDeviceTwinSagaGenerator.clone();
        expect(success.next(mockTwin)).toEqual({
            done: false,
            value: call(raiseNotificationToast, {
                text: {
                    translationKey: ResourceKeys.notifications.updateDeviceTwinOnSuccess,
                    translationOptions: {
                        deviceId
                    },
                },
                type: NotificationType.success
                })
        });
        expect(success.next()).toEqual({
            done: false,
            value: put(updateDeviceTwinAction.done({params: mockTwin, result: mockTwin}))
        });
        expect(success.next().done).toEqual(true);
    });

    it('fails on error', () => {
        const failure = updateDeviceTwinSagaGenerator.clone();
        const error = { code: -1 };
        expect(failure.throw(error)).toEqual({
            done: false,
            value: call(raiseNotificationToast, {
                text: {
                    translationKey: ResourceKeys.notifications.updateDeviceTwinOnError,
                    translationOptions: {
                        deviceId,
                        error,
                    },
                },
                type: NotificationType.error
                })
        });

        expect(failure.next(error)).toEqual({
            done: false,
            value: put(updateDeviceTwinAction.failed({params: mockTwin, error}))
        });
        expect(failure.next().done).toEqual(true);
    });

});
