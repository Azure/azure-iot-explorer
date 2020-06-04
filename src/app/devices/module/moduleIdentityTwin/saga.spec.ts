/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import 'jest';
// tslint:disable-next-line: no-implicit-dependencies
import { SagaIteratorClone, cloneableGenerator } from '@redux-saga/testing-utils';
import { call, put } from 'redux-saga/effects';
import { getModuleIdentityTwinSagaWorker } from './saga';
import { getModuleIdentityTwinAction } from './actions';
import * as ModuleService from '../../../api/services/moduleService';
import { ResourceKeys } from '../../../../localization/resourceKeys';
import { NotificationType } from '../../../api/models/notification';
import { ModuleTwin } from '../../../api/models/moduleTwin';
import { raiseNotificationToast } from '../../../notifications/components/notificationToast';

describe('getModuleIdentityTwinSagaWorker', () => {
    let getModuleIdentityTwinSagaGenerator: SagaIteratorClone;
    const deviceId = 'testDevice';
    const moduleId = 'testModule';

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
        getModuleIdentityTwinSagaGenerator = cloneableGenerator(getModuleIdentityTwinSagaWorker)(getModuleIdentityTwinAction.started(getModuleIdentityTwinParameter));
    });

    const mockGetModuleIdentityTwin = jest.spyOn(ModuleService, 'fetchModuleIdentityTwin').mockImplementationOnce(parameters => {
        return null;
    });

    it('gets the module identity twin', () => {
        expect(getModuleIdentityTwinSagaGenerator.next()).toEqual({
            done: false,
            value: call(mockGetModuleIdentityTwin, getModuleIdentityTwinParameter)
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
            value: call(raiseNotificationToast, {
                text: {
                    translationKey: ResourceKeys.notifications.getModuleIdentityTwinOnError,
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
            value: put(getModuleIdentityTwinAction.failed({params: getModuleIdentityTwinParameter, error}))
        });
        expect(failure.next().done).toEqual(true);
    });
});
