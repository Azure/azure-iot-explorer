/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { cloneableGenerator } from '@redux-saga/testing-utils';
import { put, call, select } from 'redux-saga/effects';
import { getSubscriptionListAction } from '../actions';
import { getSubscriptionListSaga } from './getSubscriptionListSaga';
import * as AzureSubscriptionService from '../../../api/services/azureSubscriptionService';
import * as AuthenticationService from '../../../api/services/authenticationService';
import { raiseNotificationToast } from '../../../notifications/components/notificationToast';
import { ResourceKeys } from '../../../../localization/resourceKeys';
import { NotificationType } from '../../../api/models/notification';

describe('getSubscriptionListSaga', () => {

    const mockGetTenantToken = jest.spyOn(AuthenticationService, 'getTenantToken').mockImplementationOnce(() => {
        return 'token';
    });
    const mockGetSubscriptions = jest.spyOn(AzureSubscriptionService, 'getAzureSubscriptions').mockImplementationOnce(() => {
        return [];
    });
    const tenantId = 'test-tenant-id';
    const sagaGenerator = cloneableGenerator(getSubscriptionListSaga)(getSubscriptionListAction.started(tenantId));

    it('calls getTenantToken with tenantId', () => {
        expect(sagaGenerator.next()).toEqual({
            done: false,
            value: call(mockGetTenantToken, tenantId)
        });
    });

    it('calls getAzureSubscriptions', () => {
        expect(sagaGenerator.next('token')).toEqual({
            done: false,
            value: call(mockGetSubscriptions, {
                authorizationToken: 'token',
                endpoint: undefined
            })
        });
    });

    it('puts the successful action', () => {
        const success = sagaGenerator.clone();
        expect(success.next([])).toEqual({
            done: false,
            value: put(getSubscriptionListAction.done({
                params: tenantId,
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
                    translationKey: ResourceKeys.authentication.azureActiveDirectory.notification.getsubscriptionListError,
                    translationOptions: {error}
                },
                type: NotificationType.error
              })
        });

        expect(failure.next(error)).toEqual({
            done: false,
            value: put(getSubscriptionListAction.failed({
                params: tenantId,
                error
            }))
        });
        expect(failure.next().done).toEqual(true);
    });
});
