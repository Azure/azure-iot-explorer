/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import 'jest';
// tslint:disable-next-line: no-implicit-dependencies
import { SagaIteratorClone, cloneableGenerator } from '@redux-saga/testing-utils';
import { call, put } from 'redux-saga/effects';
import { addModuleIdentitySagaWorker } from './saga';
import { addModuleIdentityAction } from './actions';
import * as ModuleService from '../../../api/services/moduleService';
import { ResourceKeys } from '../../../../localization/resourceKeys';
import { NotificationType } from '../../../api/models/notification';
import { ModuleIdentity } from '../../../api/models/moduleIdentity';
import { raiseNotificationToast } from '../../../notifications/components/notificationToast';

describe('addModuleIdentitySagaWorker', () => {
    let addModuleIdentitySagaGenerator: SagaIteratorClone;
    const connectionString = 'connection_string';
    const deviceId = 'testDevice';
    const moduleId = 'testModule';
    const moduleIdentity: ModuleIdentity = {
        authentication: null,
        deviceId,
        moduleId
    };
    const params = {connectionString, moduleIdentity}

    beforeAll(() => {
        addModuleIdentitySagaGenerator = cloneableGenerator(addModuleIdentitySagaWorker)(addModuleIdentityAction.started(params));
    });

    const mockAddModuleIdentity = jest.spyOn(ModuleService, 'addModuleIdentity').mockImplementationOnce(parameters => {
        return null;
    });

    it('adds the module identity', () => {
        expect(addModuleIdentitySagaGenerator.next()).toEqual({
            done: false,
            value: call(mockAddModuleIdentity, params)
        });
    });

    it('puts the successful action', () => {
        const success = addModuleIdentitySagaGenerator.clone();
        expect(success.next(moduleIdentity)).toEqual({
            done: false,
            value: call(raiseNotificationToast, {
                text: {
                    translationKey: ResourceKeys.notifications.addModuleIdentityOnSucceed,
                    translationOptions: {
                        moduleId: moduleIdentity.moduleId
                    },
                },
                type: NotificationType.success
            })
        });
        expect(success.next()).toEqual({
            done: false,
            value: put(addModuleIdentityAction.done({params, result: moduleIdentity}))
        });
        expect(success.next().done).toEqual(true);
    });

    it('fails on error', () => {
        const failure = addModuleIdentitySagaGenerator.clone();
        const error = { code: -1 };
        expect(failure.throw(error)).toEqual({
            done: false,
            value: call(raiseNotificationToast, {
                text: {
                    translationKey: ResourceKeys.notifications.addModuleIdentityOnError,
                    translationOptions: {
                        error,
                        moduleId: moduleIdentity.moduleId
                    },
                },
                type: NotificationType.error
            })
        });

        expect(failure.next(error)).toEqual({
            done: false,
            value: put(addModuleIdentityAction.failed({params, error}))
        });
        expect(failure.next().done).toEqual(true);
    });

});
