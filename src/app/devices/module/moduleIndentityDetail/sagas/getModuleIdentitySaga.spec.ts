/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import 'jest';
// tslint:disable-next-line: no-implicit-dependencies
import { SagaIteratorClone, cloneableGenerator } from '@redux-saga/testing-utils';
import { call, put } from 'redux-saga/effects';
import { getModuleIdentitySaga } from './getModuleIdentitySaga';
import { getModuleIdentityAction } from '../actions';
import * as ModuleService from '../../../../api/services/moduleService';
import { ResourceKeys } from '../../../../../localization/resourceKeys';
import { NotificationType } from '../../../../api/models/notification';
import { ModuleIdentity } from '../../../../api/models/moduleIdentity';
import { raiseNotificationToast } from '../../../../notifications/components/notificationToast';

describe('getModuleIdentitySaga', () => {
    let getModuleIdentitySagaGenerator: SagaIteratorClone;
    const deviceId = 'testDevice';
    const moduleId = 'testModule';
    const moduleIdentity: ModuleIdentity = {
        authentication: null,
        deviceId,
        moduleId
    };

    const getModuleIdentityParameter = {deviceId, moduleId};
    beforeAll(() => {
        getModuleIdentitySagaGenerator = cloneableGenerator(getModuleIdentitySaga)(getModuleIdentityAction.started(getModuleIdentityParameter));
    });

    const mockGetModuleIdentity = jest.spyOn(ModuleService, 'fetchModuleIdentity').mockImplementationOnce(parameters => {
        return null;
    });

    it('gets the module identity', () => {
        expect(getModuleIdentitySagaGenerator.next()).toEqual({
            done: false,
            value: call(mockGetModuleIdentity, getModuleIdentityParameter )
        });
    });

    it('finishes the action', () => {
        const success = getModuleIdentitySagaGenerator.clone();
        expect(success.next(moduleIdentity)).toEqual({
            done: false,
            value: put(getModuleIdentityAction.done({params: getModuleIdentityParameter, result: moduleIdentity}))
        });
        expect(success.next().done).toEqual(true);
    });

    it('fails on error', () => {
        const failure = getModuleIdentitySagaGenerator.clone();
        const error = { code: -1 };
        expect(failure.throw(error)).toEqual({
            done: false,
            value: call(raiseNotificationToast, {
                text: {
                    translationKey: ResourceKeys.notifications.getModuleIdentityOnError,
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
            value: put(getModuleIdentityAction.failed({params: getModuleIdentityParameter, error}))
        });
        expect(failure.next().done).toEqual(true);
    });
});
