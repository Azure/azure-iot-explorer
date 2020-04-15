/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import 'jest';
import { select, call, put } from 'redux-saga/effects';
import { SagaIteratorClone, cloneableGenerator } from 'redux-saga/utils';
import { patchDigitalTwinInterfacePropertiesSaga, generatePatchDigitalTwinInterfacePropertiesPayload, generateInterfacePropertiesPayload } from './digitalTwinInterfacePropertySaga';
import { patchDigitalTwinInterfacePropertiesAction } from '../actions';
import * as DigitalTwinService from '../../../api/services/digitalTwinService';
import { getActiveAzureResourceConnectionStringSaga } from '../../../azureResource/sagas/getActiveAzureResourceConnectionStringSaga';
import { addNotificationAction } from '../../../notifications/actions';
import { NotificationType } from '../../../api/models/notification';
import { ResourceKeys } from '../../../../localization/resourceKeys';
import { getComponentNameSelector } from '../selectors';

describe('digitalTwinInterfacePropertySaga', () => {
    const digitalTwinId = 'device_id';
    const connectionString = 'connection_string';

    const patchParameters = {
        digitalTwinId,
        interfacesPatchData: 123,
        propertyKey: 'name'
    };
    const patchAction = patchDigitalTwinInterfacePropertiesAction.started(patchParameters);

    describe('patchDigitalTwinInterfacePropertiesSaga', () => {
        let patchDigitalTwinInterfacePropertiesSagaGenerator: SagaIteratorClone;
        beforeAll(() => {
            patchDigitalTwinInterfacePropertiesSagaGenerator = cloneableGenerator(patchDigitalTwinInterfacePropertiesSaga)(patchAction);
        });

        const mockPatchDigitalTwinInterfaceProperties = jest.spyOn(DigitalTwinService, 'patchDigitalTwinInterfaceProperties').mockImplementationOnce(parameters => {
            return null;
        });

        it('patches the interface property', () => {
            expect(patchDigitalTwinInterfacePropertiesSagaGenerator.next()).toEqual({
                done: false,
                value: call(getActiveAzureResourceConnectionStringSaga)
            });

            expect(patchDigitalTwinInterfacePropertiesSagaGenerator.next(connectionString)).toEqual({
                done: false,
                value: call(generatePatchDigitalTwinInterfacePropertiesPayload, patchAction.payload)
            });

            expect(patchDigitalTwinInterfacePropertiesSagaGenerator.next({name: 123})).toEqual({
                done: false,
                value: call(mockPatchDigitalTwinInterfaceProperties, {
                    connectionString,
                    digitalTwinId,
                    payload: {name: 123},
                })
            });
        });

        it('puts the successful action', () => {
            const response = {};
            const success = patchDigitalTwinInterfacePropertiesSagaGenerator.clone();
            expect(success.next(response)).toEqual({
                done: false,
                value: put(addNotificationAction.started({
                        text: {
                            translationKey: ResourceKeys.notifications.patchDigitalTwinInterfacePropertiesOnSuccess,
                            translationOptions: {
                                deviceId: digitalTwinId
                            },
                        },
                        type: NotificationType.success
                    }))
            });
            expect(success.next()).toEqual({
                done: false,
                value: put(patchDigitalTwinInterfacePropertiesAction.done({
                    params: patchParameters,
                    result: response
                }))
            });
            expect(success.next().done).toEqual(true);
        });

        it('fails on error', () => {
            const failure = patchDigitalTwinInterfacePropertiesSagaGenerator.clone();
            const error = { code: -1 };
            expect(failure.throw(error)).toEqual({
                done: false,
                value: put(addNotificationAction.started({
                    text: {
                        translationKey: ResourceKeys.notifications.patchDigitalTwinInterfacePropertiesOnError,
                        translationOptions: {
                            deviceId: digitalTwinId,
                            error
                        },
                    },
                    type: NotificationType.error,
                }))
            });

            expect(failure.next(error)).toEqual({
                done: false,
                value: put(patchDigitalTwinInterfacePropertiesAction.failed({
                    error,
                    params: patchParameters
                }))
            });
            expect(failure.next().done).toEqual(true);
        });
    });

    describe('generateInterfacePropertiesPayload ', () => {
        expect(generateInterfacePropertiesPayload('testInterface', 'name', 1)).toEqual({
            interfaces: {
                testInterface: {
                    properties: {
                        name: {
                            desired: {
                                value: 1
                            }
                        }
                    }
                }
            }
        });
    });

    describe('generatePatchDigitalTwinInterfacePropertiesPayload ', () => {
        const generatePatchDigitalTwinInterfacePropertiesPayloadGenerator = cloneableGenerator(generatePatchDigitalTwinInterfacePropertiesPayload)(patchAction.payload);
        expect(generatePatchDigitalTwinInterfacePropertiesPayloadGenerator.next()).toEqual({
            done: false,
            value: select(getComponentNameSelector)
        });

        expect(generatePatchDigitalTwinInterfacePropertiesPayloadGenerator.next().done).toEqual(true);
    });
});
