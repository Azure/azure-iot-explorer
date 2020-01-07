
/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import 'jest';
import { cloneableGenerator, SagaIteratorClone } from 'redux-saga/utils';
import { call, put } from 'redux-saga/effects';
import * as DevicesService from '../../../api/services/devicesService';
import { cloudToDeviceMessageSaga } from './cloudToDeviceMessageSaga';
import { getActiveAzureResourceConnectionStringSaga } from '../../../azureResource/sagas/getActiveAzureResourceConnectionStringSaga';
import { cloudToDeviceMessageAction } from '../actions';
import { addNotificationAction } from '../../../notifications/actions';
import { ResourceKeys } from '../../../../localization/resourceKeys';
import { NotificationType } from '../../../api/models/notification';
import { CloudToDeviceMessageParameters } from './../../../api/parameters/deviceParameters';

describe('directMethodSaga', () => {
    let cloudToDeviceMessageSagaGenerator: SagaIteratorClone;
    const mockCloudToDeviceMessage = jest.spyOn(DevicesService, 'cloudToDeviceMessage').mockImplementation(parameters => {
        return null;
    });

    const randomNumber = 0;
    const mockRandom = jest.spyOn(Math, 'random').mockImplementation(() => {
        return randomNumber;
    });

    const connectionString = 'connection_string';
    const deviceId = 'device_id';
    const message = 'message';

    const cloudToDeviceMessageParameters: CloudToDeviceMessageParameters = {
        body: message,
        connectionString,
        deviceId
    };

    beforeAll(() => {
        cloudToDeviceMessageSagaGenerator = cloneableGenerator(cloudToDeviceMessageSaga)(cloudToDeviceMessageAction.started(cloudToDeviceMessageParameters));
    });

    describe('cloudToDeviceMessageSaga', () => {

        it('notifies that sending message started', () => {
            expect(cloudToDeviceMessageSagaGenerator.next()).toEqual({
                done: false,
                value: put(addNotificationAction.started({
                    id: randomNumber,
                    text: {
                        translationKey: ResourceKeys.notifications.sendingCloudToDeviceMessage,
                        translationOptions: {
                            deviceId,
                            message
                        },
                    },
                    type: NotificationType.info
                }))
            });
        });

        it('yields call to get active azure connection string', () => {
            expect(cloudToDeviceMessageSagaGenerator.next()).toEqual({
                done: false,
                value: call(getActiveAzureResourceConnectionStringSaga)
            });
        });

        it('successfully send cloud to device message', () => {
            const success = cloudToDeviceMessageSagaGenerator.clone();

            expect(success.next(connectionString)).toEqual({
                done: false,
                value: call(mockCloudToDeviceMessage, cloudToDeviceMessageParameters)
            });

            expect(success.next('')).toEqual({
                done: false,
                value: put(addNotificationAction.started({
                    id: randomNumber,
                    text: {
                        translationKey: ResourceKeys.notifications.cloudToDeviceMessageOnSuccess,
                        translationOptions: {
                            deviceId,
                            message
                        },
                    },
                    type: NotificationType.success
                }))
            });

            expect(success.next()).toEqual({
                done: false,
                value: put(cloudToDeviceMessageAction.done({
                    params: cloudToDeviceMessageParameters,
                    result: ''
                }))
            });

            expect(success.next()).toEqual({
                done: true
            });
        });

        it('fails', () => {
            const failed = cloudToDeviceMessageSagaGenerator.clone();
            const error = { code: -1 };

            expect(failed.throw(error)).toEqual({
                done: false,
                value: put(addNotificationAction.started({
                    id: randomNumber,
                    text: {
                        translationKey: ResourceKeys.notifications.cloudToDeviceMessageOnError,
                        translationOptions: {
                            deviceId,
                            error
                        },
                    },
                    type: NotificationType.error
                }))
            });

            expect(failed.next(error)).toEqual({
                done: false,
                value: put(cloudToDeviceMessageAction.failed({
                    error,
                    params: cloudToDeviceMessageParameters
                }))
            });

            expect(failed.next().done).toEqual(true);
        });
    });
});
