/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import 'jest';
// tslint:disable-next-line: no-implicit-dependencies
import { SagaIteratorClone, cloneableGenerator } from '@redux-saga/testing-utils';
import { call, put } from 'redux-saga/effects';
import { deleteModuleIdentitySaga } from './deleteModuleIdentitySaga';
import { deleteModuleIdentityAction } from '../actions';
import * as ModuleService from '../../../../api/services/moduleService';
import { ResourceKeys } from '../../../../../localization/resourceKeys';
import { NotificationType } from '../../../../api/models/notification';
import { ModuleIdentity } from '../../../../api/models/moduleIdentity';
import { raiseNotificationToast } from '../../../../notifications/components/notificationToast';

describe('moduleIdentitySaga', () => {
    let deleteModuleIdentitySagaGenerator: SagaIteratorClone;
    const deviceId = 'testDevice';
    const moduleId = 'testModule';
    const deleteModuleIdentityParameter = {deviceId, moduleId};

    beforeAll(() => {
        deleteModuleIdentitySagaGenerator = cloneableGenerator(deleteModuleIdentitySaga)(deleteModuleIdentityAction.started(deleteModuleIdentityParameter));
    });

    const mockDeleteModuleIdentity = jest.spyOn(ModuleService, 'deleteModuleIdentity').mockImplementationOnce(parameters => {
        return null;
    });

    it('deletes the module identity', () => {
        expect(deleteModuleIdentitySagaGenerator.next()).toEqual({
            done: false,
            value: call(mockDeleteModuleIdentity, deleteModuleIdentityParameter)
        });
    });

    it('puts the successful action', () => {
        const success = deleteModuleIdentitySagaGenerator.clone();
        expect(success.next()).toEqual({
            done: false,
            value: call(raiseNotificationToast, {
                text: {
                    translationKey: ResourceKeys.notifications.deleteModuleIdentityOnSuccess,
                    translationOptions: {
                        moduleId
                    },
                },
                type: NotificationType.success
            })
        });
        expect(success.next()).toEqual({
            done: false,
            value: put(deleteModuleIdentityAction.done({params: deleteModuleIdentityParameter}))
        });
        expect(success.next().done).toEqual(true);
    });

    it('fails on error', () => {
        const failure = deleteModuleIdentitySagaGenerator.clone();
        const error = { code: -1 };
        expect(failure.throw(error)).toEqual({
            done: false,
            value: call(raiseNotificationToast, {
                text: {
                    translationKey: ResourceKeys.notifications.deleteModuleIdentityOnError,
                    translationOptions: {
                        error,
                        moduleId
                    },
                },
                type: NotificationType.error
            })
        });

        expect(failure.next(error)).toEqual({
            done: false,
            value: put(deleteModuleIdentityAction.failed({params: deleteModuleIdentityParameter, error}))
        });
        expect(failure.next().done).toEqual(true);
    });
});
