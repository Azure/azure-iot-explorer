/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { cloneableGenerator } from '@redux-saga/testing-utils';
import { put, call } from 'redux-saga/effects';
import { getIotHubsBySubscriptionAction } from '../actions';
import { getIotHubListSaga } from './getIotHubListSaga';
import * as IotHubService from '../../../api/services/iotHubService';
import * as AuthenticationService from '../../../api/services/authenticationService';
import { raiseNotificationToast } from '../../../notifications/components/notificationToast';
import { ResourceKeys } from '../../../../localization/resourceKeys';
import { NotificationType } from '../../../api/models/notification';

describe('getIotHubListSaga', () => {

    const mockGetProfileToken = jest.spyOn(AuthenticationService, 'getProfileToken').mockImplementationOnce(() => {
        return 'token';
    });
    const mockGetIotHubs = jest.spyOn(IotHubService, 'getIotHubsBySubscription').mockImplementationOnce(() => {
        return [];
    });
    const sagaGenerator = cloneableGenerator(getIotHubListSaga)(getIotHubsBySubscriptionAction.started('subscriptionId'));

    it('calls getProfileToken', () => {
        expect(sagaGenerator.next()).toEqual({
            done: false,
            value: call(mockGetProfileToken)
        });
    });

    it('calls getIotHubsBySubscription', () => {
        expect(sagaGenerator.next('token')).toEqual({
            done: false,
            value: call(mockGetIotHubs, {
                authorizationToken: 'token',
                endpoint: undefined,
                subscriptionId: 'subscriptionId',
            })
        });
    });

    it('puts the successful action', () => {
        const success = sagaGenerator.clone();
        expect(success.next([])).toEqual({
            done: false,
            value: put(getIotHubsBySubscriptionAction.done({
                params: 'subscriptionId',
                result: []
            }))
        });
        expect(success.next().done).toEqual(true);
    });

    it('fails on error', () => {
        const failure = sagaGenerator.clone();
        const error = { message: 'error' };
        expect(failure.throw(error)).toEqual({
            done: false,
            value: call(raiseNotificationToast, {
                text: {
                    translationKey: ResourceKeys.authentication.azureActiveDirectory.notification.getIotHubListError,
                    translationOptions: {error: 'error'}
                },
                type: NotificationType.error
              })
        });

        expect(failure.next(error)).toEqual({
            done: false,
            value: put(getIotHubsBySubscriptionAction.failed({
                error,
                params: 'subscriptionId',
            }))
        });
        expect(failure.next().done).toEqual(true);
    });
});
