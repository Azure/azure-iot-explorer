/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import 'jest';
import { SagaIteratorClone, cloneableGenerator } from 'redux-saga/utils';
import { select, call, put } from 'redux-saga/effects';
import { getModuleIdentitiesSaga } from './moduleIdentitySaga';
import { getModuleIdentitiesAction } from '../actions';
import { getConnectionStringSelector } from '../../../login/selectors';
import * as DevicesService from '../../../api/services/devicesService';
import { addNotificationAction } from '../../../notifications/actions';
import { ResourceKeys } from '../../../../localization/resourceKeys';
import { NotificationType } from '../../../api/models/notification';
import { ModuleIdentity } from '../../../api/models/moduleIdentity';

describe('moduleIdentitySaga', () => {
    let getModuleIdentitySagaGenerator: SagaIteratorClone;

    const connectionString = 'connection_string';
    const deviceId = 'device_id';

    const mockModuleIdentities: ModuleIdentity[] = [{
        authentication: null,
        deviceId: 'testDevice',
        moduleId: 'testModule'
    }];

    describe('getModuleIdentitiesSaga', () => {

        beforeAll(() => {
            getModuleIdentitySagaGenerator = cloneableGenerator(getModuleIdentitiesSaga)(getModuleIdentitiesAction.started(deviceId));
        });

        const mockFetchModuleIdentities = jest.spyOn(DevicesService, 'fetchModuleIdentities').mockImplementationOnce(parameters => {
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

});
