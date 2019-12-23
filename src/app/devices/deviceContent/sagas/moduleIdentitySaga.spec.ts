/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import 'jest';
import { SagaIteratorClone, cloneableGenerator } from 'redux-saga/utils';
import { select, call, put } from 'redux-saga/effects';
import { getModuleIdentitiesSaga, addModuleIdentitySaga, getModuleIdentityTwinSaga } from './moduleIdentitySaga';
import { getModuleIdentitiesAction, addModuleIdentityAction, getModuleIdentityTwinAction } from '../actions';
import { getConnectionStringSelector } from '../../../login/selectors';
import * as DevicesService from '../../../api/services/devicesService';
import { addNotificationAction } from '../../../notifications/actions';
import { ResourceKeys } from '../../../../localization/resourceKeys';
import { NotificationType } from '../../../api/models/notification';
import { ModuleIdentity, ModuleTwin } from '../../../api/models/moduleIdentity';
import { getActiveAzureResourceConnectionStringSaga } from '../../../azureResource/sagas/getActiveAzureResourceConnectionStringSaga';

describe('moduleIdentitySaga', () => {
    let getModuleIdentitySagaGenerator: SagaIteratorClone;
    let addModuleIdentitySagaGenerator: SagaIteratorClone;
    let getModuleIdentityTwinSagaGenerator: SagaIteratorClone;

    const connectionString = 'connection_string';
    const deviceId = 'testDevice';
    const moduleId = 'testModule';
    const moduleIdentity: ModuleIdentity = {
        authentication: null,
        deviceId,
        moduleId
    };

    describe('getModuleIdentitiesSaga', () => {
        const mockModuleIdentities: ModuleIdentity[] = [moduleIdentity];
        beforeAll(() => {
            getModuleIdentitySagaGenerator = cloneableGenerator(getModuleIdentitiesSaga)(getModuleIdentitiesAction.started(deviceId));
        });

        const mockFetchModuleIdentities = jest.spyOn(DevicesService, 'fetchModuleIdentities').mockImplementationOnce(() => {
            return null;
        });

        it('fetches the connection string', () => {
            expect(getModuleIdentitySagaGenerator.next()).toEqual({
                done: false,
                value: select(getConnectionStringSelector)
            });
        });

        it('fetches the module identities', () => {
            expect(getModuleIdentitySagaGenerator.next(connectionString)).toEqual({
                done: false,
                value: call(mockFetchModuleIdentities, { connectionString, deviceId })
            });
        });

        it('puts the successful action', () => {
            const success = getModuleIdentitySagaGenerator.clone();
            expect(success.next(mockModuleIdentities)).toEqual({
                done: false,
                value: put(getModuleIdentitiesAction.done({params: deviceId, result: mockModuleIdentities}))
            });
            expect(success.next().done).toEqual(true);
        });

        it('fails on error', () => {
            const failure = getModuleIdentitySagaGenerator.clone();
            const error = { code: -1 };
            expect(failure.throw(error)).toEqual({
                done: false,
                value: put(addNotificationAction.started({
                    text: {
                        translationKey: ResourceKeys.notifications.getModuleIdentitiesOnError,
                        translationOptions: {
                            deviceId,
                            error,
                        },
                    },
                    type: NotificationType.error
                }))
            });

            expect(failure.next(error)).toEqual({
                done: false,
                value: put(getModuleIdentitiesAction.failed({params: deviceId, error}))
            });
            expect(failure.next().done).toEqual(true);
        });

    });

    describe('addModuleIdentitySaga', () => {

        beforeAll(() => {
            addModuleIdentitySagaGenerator = cloneableGenerator(addModuleIdentitySaga)(addModuleIdentityAction.started(moduleIdentity));
        });

        const mockAddModuleIdentity = jest.spyOn(DevicesService, 'addModuleIdentity').mockImplementationOnce(parameters => {
            return null;
        });

        it('fetches the connection string', () => {
            expect(addModuleIdentitySagaGenerator.next()).toEqual({
                done: false,
                value: select(getConnectionStringSelector)
            });
        });

        it('adds the module identity', () => {
            expect(addModuleIdentitySagaGenerator.next(connectionString)).toEqual({
                done: false,
                value: call(mockAddModuleIdentity, { connectionString, moduleIdentity })
            });
        });

        it('puts the successful action', () => {
            const success = addModuleIdentitySagaGenerator.clone();
            expect(success.next(moduleIdentity)).toEqual({
                done: false,
                value: put(addNotificationAction.started({
                    text: {
                        translationKey: ResourceKeys.notifications.addModuleIdentityOnSucceed,
                        translationOptions: {
                            moduleId: moduleIdentity.moduleId
                        },
                    },
                    type: NotificationType.success
                }))
            });
            expect(success.next()).toEqual({
                done: false,
                value: put(addModuleIdentityAction.done({params: moduleIdentity, result: moduleIdentity}))
            });
            expect(success.next().done).toEqual(true);
        });

        it('fails on error', () => {
            const failure = addModuleIdentitySagaGenerator.clone();
            const error = { code: -1 };
            expect(failure.throw(error)).toEqual({
                done: false,
                value: put(addNotificationAction.started({
                    text: {
                        translationKey: ResourceKeys.notifications.addModuleIdentityOnError,
                        translationOptions: {
                            error,
                            moduleId: moduleIdentity.moduleId
                        },
                    },
                    type: NotificationType.error
                }))
            });

            expect(failure.next(error)).toEqual({
                done: false,
                value: put(addModuleIdentityAction.failed({params: moduleIdentity, error}))
            });
            expect(failure.next().done).toEqual(true);
        });

    });

    describe('getModuleIdentityTwinSaga', () => {

        const getModuleIdentityTwinParameter = {deviceId, moduleId};
        // tslint:disable
        const moduleIdentityTwin: ModuleTwin = {
            deviceId: 'deviceId',
            moduleId: 'moduleId',
            etag: 'AAAAAAAAAAE=',
            deviceEtag: 'AAAAAAAAAAE=',
            status: 'enabled',
            statusUpdateTime: '0001-01-01T00:00:00Z',
            lastActivityTime: '0001-01-01T00:00:00Z',
            x509Thumbprint:  {primaryThumbprint: null, secondaryThumbprint: null},
            version: 1,
            connectionState: 'Disconnected',
            cloudToDeviceMessageCount: 0,
            authenticationType:'sas',
            properties: {}
        }
        // tslint:enable
        beforeAll(() => {
            getModuleIdentityTwinSagaGenerator = cloneableGenerator(getModuleIdentityTwinSaga)(getModuleIdentityTwinAction.started(getModuleIdentityTwinParameter));
        });

        const mockGetModuleIdentityTwin = jest.spyOn(DevicesService, 'fetchModuleIdentityTwin').mockImplementationOnce(parameters => {
            return null;
        });

        it('fetches the connection string', () => {
            expect(getModuleIdentityTwinSagaGenerator.next()).toEqual({
                done: false,
                value: call(getActiveAzureResourceConnectionStringSaga)
            });
        });

        it('gets the module identity twin', () => {
            expect(getModuleIdentityTwinSagaGenerator.next(connectionString)).toEqual({
                done: false,
                value: call(mockGetModuleIdentityTwin, { connectionString, ...getModuleIdentityTwinParameter })
            });
        });

        it('finishes the action', () => {
            const success = getModuleIdentityTwinSagaGenerator.clone();
            expect(success.next(moduleIdentityTwin)).toEqual({
                done: false,
                value: put(getModuleIdentityTwinAction.done({params: getModuleIdentityTwinParameter, result: moduleIdentityTwin}))
            });
            expect(success.next().done).toEqual(true);
        });

        it('fails on error', () => {
            const failure = getModuleIdentityTwinSagaGenerator.clone();
            const error = { code: -1 };
            expect(failure.throw(error)).toEqual({
                done: false,
                value: put(addNotificationAction.started({
                    text: {
                        translationKey: ResourceKeys.notifications.getModuleIdentityTwinOnError,
                        translationOptions: {
                            error,
                            moduleId
                        },
                    },
                    type: NotificationType.error
                }))
            });

            expect(failure.next(error)).toEqual({
                done: false,
                value: put(getModuleIdentityTwinAction.failed({params: getModuleIdentityTwinParameter, error}))
            });
            expect(failure.next().done).toEqual(true);
        });

    });

});
