/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import 'jest';
import { select, call, put } from 'redux-saga/effects';
import { SagaIteratorClone, cloneableGenerator } from 'redux-saga/utils';
import { getDigitalTwinInterfacePropertySaga, patchDigitalTwinInterfacePropertiesSaga, generatePatchDigitalTwinInterfacePropertiesPayload, generateInterfacePropertiesPayload } from './digitalTwinInterfacePropertySaga';
import { getDigitalTwinInterfacePropertiesAction, patchDigitalTwinInterfacePropertiesAction } from '../actions';
import * as DevicesService from '../../../api/services/devicesService';
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

    describe('getDigitalTwinInterfacePropertySaga', () => {
        let getDigitalTwinInterfacePropertySagaGenerator: SagaIteratorClone;
        beforeAll(() => {
            getDigitalTwinInterfacePropertySagaGenerator = cloneableGenerator(getDigitalTwinInterfacePropertySaga)(getDigitalTwinInterfacePropertiesAction.started(digitalTwinId));
        });

        const mockFetchDigitalTwinInterfaceProperties = jest.spyOn(DevicesService, 'fetchDigitalTwinInterfaceProperties').mockImplementationOnce(parameters => {
            return null;
        });

        it('fetches the interface property', () => {
            expect(getDigitalTwinInterfacePropertySagaGenerator.next()).toEqual({
                done: false,
                value: call(getActiveAzureResourceConnectionStringSaga)
            });

            expect(getDigitalTwinInterfacePropertySagaGenerator.next(connectionString)).toEqual({
                done: false,
                value: call(mockFetchDigitalTwinInterfaceProperties, {
                    connectionString,
                    digitalTwinId
                })
            });
        });

        it('puts the successful action', () => {
            const success = getDigitalTwinInterfacePropertySagaGenerator.clone();
            const response = {};
            expect(success.next(response)).toEqual({
                done: false,
                value: put(getDigitalTwinInterfacePropertiesAction.done({
                    params: digitalTwinId,
                    result: response
                }))
            });
            expect(success.next().done).toEqual(true);
        });

        it('fails on error', () => {
            const failure = getDigitalTwinInterfacePropertySagaGenerator.clone();
            const error = { code: -1 };
            expect(failure.throw(error)).toEqual({
                done: false,
                value: put(getDigitalTwinInterfacePropertiesAction.failed({
                    error,
                    params: digitalTwinId
                }))
            });
            expect(failure.next().done).toEqual(true);
        });
    });

    describe('patchDigitalTwinInterfacePropertiesSaga', () => {
        let patchDigitalTwinInterfacePropertiesSagaGenerator: SagaIteratorClone;
        beforeAll(() => {
            patchDigitalTwinInterfacePropertiesSagaGenerator = cloneableGenerator(patchDigitalTwinInterfacePropertiesSaga)(patchAction);
        });

        const mockFetchDigitalTwinInterfaceProperties = jest.spyOn(DevicesService, 'patchDigitalTwinInterfaceProperties').mockImplementationOnce(parameters => {
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
                value: call(mockFetchDigitalTwinInterfaceProperties, {
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
