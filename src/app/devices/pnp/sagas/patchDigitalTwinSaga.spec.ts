/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import 'jest';
// tslint:disable-next-line: no-implicit-dependencies
import { SagaIteratorClone, cloneableGenerator } from '@redux-saga/testing-utils';
import { call, put } from 'redux-saga/effects';
import { patchDigitalTwinSaga } from './patchDigitalTwinSaga';
import { patchDigitalTwinAction, PatchDigitalTwinActionParameters } from '../actions';
import * as DigitalTwinService from '../../../api/services/digitalTwinService';
import { raiseNotificationToast } from '../../../notifications/components/notificationToast';
import { ResourceKeys } from '../../../../localization/resourceKeys';
import { NotificationType } from '../../../api/models/notification';
import { JsonPatchOperation } from '../../../api/parameters/deviceParameters';

describe('digitalTwinSaga', () => {
    const mockFetchDigitalTwin = jest.spyOn(DigitalTwinService, 'fetchDigitalTwin').mockImplementationOnce(parameters => {
        return null;
    });
    const digitalTwinId = 'device_id';

    /* tslint:disable */
    const digitalTwin = {
        "$dtId": "testDevice",
        "environmentalSensor": {
        "state": true,
        "$metadata": {
            "state": {
            "lastUpdateTime": "2020-03-31T23:17:42.4813073Z"
            }
        }
        },
        "$metadata": {
        "$model": "urn:azureiot:samplemodel:1"
        }
    };
    /* tslint:enable */

    describe('patchDigitalTwinSaga', () => {
        const patchParameters: PatchDigitalTwinActionParameters = {
            digitalTwinId,
            payload: [{
                op: JsonPatchOperation.ADD,
                path: 'name',
                value: 123,
            }]
        };
        const patchAction = patchDigitalTwinAction.started(patchParameters);
        let patchDigitalTwinSagaGenerator: SagaIteratorClone;
        beforeAll(() => {
            patchDigitalTwinSagaGenerator = cloneableGenerator(patchDigitalTwinSaga)(patchAction);
        });

        const mockPatchDigitalTwin = jest.spyOn(DigitalTwinService, 'patchDigitalTwinAndGetResponseCode').mockImplementationOnce(parameters => {
            return null;
        });

        it('patches the digital twin', () => {
            expect(patchDigitalTwinSagaGenerator.next()).toEqual({
                done: false,
                value: call(mockPatchDigitalTwin, {
                    ...patchParameters
                })
            });
        });

        it('fetches the digital twin', () => {
            // tslint:disable-next-line: no-magic-numbers
            expect(patchDigitalTwinSagaGenerator.next(200)).toEqual({
                done: false,
                value: call(mockFetchDigitalTwin, {
                    digitalTwinId
                })
            });
        });

        it('puts the successful action', () => {
            const success = patchDigitalTwinSagaGenerator.clone();
            expect(success.next(digitalTwin)).toEqual({
                done: false,
                value: call(raiseNotificationToast, {
                        text: {
                            translationKey: ResourceKeys.notifications.patchDigitalTwinOnSuccess,
                            translationOptions: {
                                deviceId: digitalTwinId
                            },
                        },
                        type: NotificationType.success
                    })
            });
            expect(success.next()).toEqual({
                done: false,
                value: put(patchDigitalTwinAction.done({
                    params: patchParameters,
                    result: digitalTwin
                }))
            });
            expect(success.next().done).toEqual(true);
        });

        it('fails on error', () => {
            const failure = patchDigitalTwinSagaGenerator.clone();
            const error = { code: -1 };
            expect(failure.throw(error)).toEqual({
                done: false,
                value: call(raiseNotificationToast, {
                    text: {
                        translationKey: ResourceKeys.notifications.patchDigitalTwinOnError,
                        translationOptions: {
                            deviceId: digitalTwinId,
                            error
                        },
                    },
                    type: NotificationType.error,
                })
            });

            expect(failure.next(error)).toEqual({
                done: false,
                value: put(patchDigitalTwinAction.failed({
                    error,
                    params: patchParameters
                }))
            });
            expect(failure.next().done).toEqual(true);
        });
    });
});
