/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import 'jest';
// tslint:disable-next-line: no-implicit-dependencies
import { SagaIteratorClone, cloneableGenerator } from '@redux-saga/testing-utils';
import { call, put } from 'redux-saga/effects';
import { getDeviceTwinAction } from '../actions';
import * as DevicesService from '../../../../api/services/devicesService';
import { Twin } from '../../../../api/models/device';
import { raiseNotificationToast } from '../../../../notifications/components/notificationToast';
import { ResourceKeys } from '../../../../../localization/resourceKeys';
import { NotificationType } from '../../../../api/models/notification';
import { getDeviceTwinSaga } from './getDeviceTwinSaga';

describe('getDeviceTwinSaga', () => {
    let getDeviceTwinSagaGenerator: SagaIteratorClone;

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
        getDeviceTwinSagaGenerator = cloneableGenerator(getDeviceTwinSaga)(getDeviceTwinAction.started(deviceId));
    });

    const mockFetchDeviceTwin = jest.spyOn(DevicesService, 'fetchDeviceTwin').mockImplementationOnce(parameters => {
        return null;
    });

    it('fetches the device twin', () => {
        expect(getDeviceTwinSagaGenerator.next()).toEqual({
            done: false,
            value: call(mockFetchDeviceTwin, { deviceId })
        });
    });

    it('puts the successful action', () => {
        const success = getDeviceTwinSagaGenerator.clone();
        expect(success.next(mockTwin)).toEqual({
            done: false,
            value: put(getDeviceTwinAction.done({params: deviceId, result: mockTwin}))
        });
        expect(success.next().done).toEqual(true);
    });

    it('fails on error', () => {
        const failure = getDeviceTwinSagaGenerator.clone();
        const error = { code: -1 };
        expect(failure.throw(error)).toEqual({
            done: false,
            value: call(raiseNotificationToast, {
                text: {
                    translationKey: ResourceKeys.notifications.getDeviceTwinOnError,
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
            value: put(getDeviceTwinAction.failed({params: deviceId, error}))
        });
        expect(failure.next().done).toEqual(true);
    });
});
