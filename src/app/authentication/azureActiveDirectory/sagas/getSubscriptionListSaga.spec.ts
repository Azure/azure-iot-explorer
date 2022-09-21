/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { cloneableGenerator } from '@redux-saga/testing-utils';
import { put, call } from 'redux-saga/effects';
import { getSubscriptionListAction } from '../actions';
import { getSubscriptionListSaga } from './getSubscriptionListSaga';
import * as AzureSubscriptionService from '../../../api/services/azureSubscriptionService';
import * as AuthenticationService from '../../../api/services/authenticationService';
import { raiseNotificationToast } from '../../../notifications/components/notificationToast';
import { ResourceKeys } from '../../../../localization/resourceKeys';
import { NotificationType } from '../../../api/models/notification';

describe('getSubscriptionListSaga', () => {

    const mockGetProfileToken = jest.spyOn(AuthenticationService, 'getProfileToken').mockImplementationOnce(() => {
        return 'token';
    });
    const mockGetIubscriptions = jest.spyOn(AzureSubscriptionService, 'getAzureSubscriptions').mockImplementationOnce(() => {
        return [];
    });
    const sagaGenerator = cloneableGenerator(getSubscriptionListSaga)(getSubscriptionListAction.started());

    it('calls getProfileToken', () => {
        expect(sagaGenerator.next()).toEqual({
            done: false,
            value: call(mockGetProfileToken)
        });
    });

    it('calls getIotHubsBySubscription', () => {
        expect(sagaGenerator.next('token')).toEqual({
            done: false,
            value: call(mockGetIubscriptions, {
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
                error
            }))
        });
        expect(failure.next().done).toEqual(true);
    });
});
