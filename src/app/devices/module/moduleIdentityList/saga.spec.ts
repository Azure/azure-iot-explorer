/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import 'jest';
// tslint:disable-next-line: no-implicit-dependencies
import { SagaIteratorClone, cloneableGenerator } from '@redux-saga/testing-utils';
import { call, put } from 'redux-saga/effects';
import { getModuleIdentitiesSagaWorker } from './saga';
import { getModuleIdentitiesAction } from './actions';
import * as ModuleService from '../../../api/services/moduleService';
import { ResourceKeys } from '../../../../localization/resourceKeys';
import { NotificationType } from '../../../api/models/notification';
import { ModuleIdentity } from '../../../api/models/moduleIdentity';
import { raiseNotificationToast } from '../../../notifications/components/notificationToast';

describe('getModuleIdentitiesSaga', () => {
    let getModuleIdentitiesSagaGenerator: SagaIteratorClone;
    const deviceId = 'testDevice';
    const moduleId = 'testModule';
    const connectionString = 'connection_string';
    const params = {connectionString, deviceId}
    const moduleIdentity: ModuleIdentity = {
        authentication: null,
        deviceId,
        moduleId
    };
    const mockModuleIdentities: ModuleIdentity[] = [moduleIdentity];
    const action = getModuleIdentitiesAction.started(params);

    beforeAll(() => {
        getModuleIdentitiesSagaGenerator = cloneableGenerator(getModuleIdentitiesSagaWorker)(action);
    });

    const mockFetchModuleIdentities = jest.spyOn(ModuleService, 'fetchModuleIdentities').mockImplementationOnce(() => {
        return null;
    });

    it('fetches the module identities', () => {
        expect(getModuleIdentitiesSagaGenerator.next()).toEqual({
            done: false,
            value: call(mockFetchModuleIdentities, params)
        });
    });

    it('puts the successful action', () => {
        const success = getModuleIdentitiesSagaGenerator.clone();
        expect(success.next(mockModuleIdentities)).toEqual({
            done: false,
            value: put(getModuleIdentitiesAction.done({params, result: mockModuleIdentities}))
        });
        expect(success.next().done).toEqual(true);
    });

    it('fails on error', () => {
        const failure = getModuleIdentitiesSagaGenerator.clone();
        const error = { code: -1 };
        expect(failure.throw(error)).toEqual({
            done: false,
            value: call(raiseNotificationToast, {
                text: {
                    translationKey: ResourceKeys.notifications.getModuleIdentitiesOnError,
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
            value: put(getModuleIdentitiesAction.failed({params, error}))
        });
        expect(failure.next().done).toEqual(true);
    });
});
