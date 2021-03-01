/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import 'jest';
// tslint:disable-next-line: no-implicit-dependencies
import { SagaIteratorClone, cloneableGenerator } from '@redux-saga/testing-utils';
import { call, put } from 'redux-saga/effects';
import { updateModuleIdentityTwinSaga } from './updateModuleIdentityTwinSaga';
import { updateModuleIdentityTwinAction } from '../actions';
import * as ModuleService from '../../../../api/services/moduleService';
import { ResourceKeys } from '../../../../../localization/resourceKeys';
import { NotificationType } from '../../../../api/models/notification';
import { ModuleTwin } from '../../../../api/models/moduleTwin';
import { raiseNotificationToast } from '../../../../notifications/components/notificationToast';

describe('updateModuleIdentityTwinSaga', () => {
    let updateModuleIdentityTwinSagaGenerator: SagaIteratorClone;

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
        updateModuleIdentityTwinSagaGenerator = cloneableGenerator(updateModuleIdentityTwinSaga)(updateModuleIdentityTwinAction.started(moduleIdentityTwin));
    });

    const mockUpdateModuleIdentityTwin = jest.spyOn(ModuleService, 'updateModuleIdentityTwin').mockImplementationOnce(parameters => {
        return null;
    });

    it('updates the module identity twin', () => {
        expect(updateModuleIdentityTwinSagaGenerator.next()).toEqual({
            done: false,
            value: call(mockUpdateModuleIdentityTwin, moduleIdentityTwin)
        });
    });

    it('finishes the action', () => {
        const success = updateModuleIdentityTwinSagaGenerator.clone();
        expect(success.next(moduleIdentityTwin)).toEqual({
            done: false,
            value: put(updateModuleIdentityTwinAction.done({params: moduleIdentityTwin, result: moduleIdentityTwin}))
        });
        expect(success.next().done).toEqual(true);
    });

    it('fails on error', () => {
        const failure = updateModuleIdentityTwinSagaGenerator.clone();
        const error = { code: -1 };
        expect(failure.throw(error)).toEqual({
            done: false,
            value: call(raiseNotificationToast, {
                text: {
                    translationKey: ResourceKeys.notifications.updateModuleIdentityTwinOnError,
                    translationOptions: {
                        error,
                        moduleId: moduleIdentityTwin.moduleId
                    },
                },
                type: NotificationType.error
            })
        });

        expect(failure.next(error)).toEqual({
            done: false,
            value: put(updateModuleIdentityTwinAction.failed({params: moduleIdentityTwin, error}))
        });
        expect(failure.next().done).toEqual(true);
    });
});
