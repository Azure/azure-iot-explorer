/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { cloneableGenerator } from '@redux-saga/testing-utils';
import { put, call } from 'redux-saga/effects';
import { getTenantListAction } from '../actions';
import { getTenantListSaga } from './getTenantListSaga';
import * as AzureTenantService from '../../../api/services/azureTenantService';
import * as AuthenticationService from '../../../api/services/authenticationService';
import { raiseNotificationToast } from '../../../notifications/components/notificationToast';
import { ResourceKeys } from '../../../../localization/resourceKeys';
import { NotificationType } from '../../../api/models/notification';

describe('getTenantListSaga', () => {

    const mockGetProfileToken = jest.spyOn(AuthenticationService, 'getProfileToken').mockImplementationOnce(() => {
        return 'token';
    });
    const mockGetTenants = jest.spyOn(AzureTenantService, 'getAzureTenants').mockImplementationOnce(() => {
        return [];
    });
    const sagaGenerator = cloneableGenerator(getTenantListSaga)(getTenantListAction.started());

    it('calls getProfileToken', () => {
        expect(sagaGenerator.next()).toEqual({
            done: false,
            value: call(mockGetProfileToken)
        });
    });

    it('calls getAzureTenants', () => {
        expect(sagaGenerator.next('token')).toEqual({
            done: false,
            value: call(mockGetTenants, {
                authorizationToken: 'token',
                endpoint: undefined
            })
        });
    });

    it('puts the successful action', () => {
        const success = sagaGenerator.clone();
        expect(success.next([])).toEqual({
            done: false,
            value: put(getTenantListAction.done({
                result: []
            }))
        });
        expect(success.next().done).toEqual(true);
    });

    it('fails on error', () => {
        const failure = sagaGenerator.clone();
        const error = { code: -1 };
        expect(failure.throw(error)).toEqual({
            done: false,
            value: call(raiseNotificationToast, {
                text: {
                    translationKey: ResourceKeys.authentication.azureActiveDirectory.notification.getTenantListError,
                    translationOptions: {error}
                },
                type: NotificationType.error
              })
        });

        expect(failure.next(error)).toEqual({
            done: false,
            value: put(getTenantListAction.failed({
                error
            }))
        });
        expect(failure.next().done).toEqual(true);
    });
});
