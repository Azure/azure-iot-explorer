/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { cloneableGenerator } from '@redux-saga/testing-utils';
import { put, call } from 'redux-saga/effects';
import { getIoTHubKeyAction } from '../actions';
import { formatConnectionString, getIotHubKeySaga } from './getIotHubKeySaga';
import * as IotHubService from '../../../api/services/iotHubService';
import * as AuthenticationService from '../../../api/services/authenticationService';
import { raiseNotificationToast } from '../../../notifications/components/notificationToast';
import { ResourceKeys } from '../../../../localization/resourceKeys';
import { NotificationType } from '../../../api/models/notification';

describe('getIotHubKeySaga', () => {

    const mockGetProfileToken = jest.spyOn(AuthenticationService, 'getProfileToken').mockImplementationOnce(() => {
        return 'token';
    });
    const mockGetIotKeys = jest.spyOn(IotHubService, 'getIotHubKeys').mockImplementationOnce(() => {
        return [];
    });
    const params = {hubId: 'hubid', hubName: 'test'};
    const authRules = [{
        keyName: 'iothubowner',
        primaryKey: '',
        rights: 'RegistryWrite, ServiceConnect, DeviceConnect'
    }]
    const sagaGenerator = cloneableGenerator(getIotHubKeySaga)(getIoTHubKeyAction.started(params));

    it('calls getProfileToken', () => {
        expect(sagaGenerator.next()).toEqual({
            done: false,
            value: call(mockGetProfileToken)
        });
    });

    it('calls getIotHubKeys', () => {
        expect(sagaGenerator.next('token')).toEqual({
            done: false,
            value: call(mockGetIotKeys, {
                authorizationToken: 'token',
                endpoint: undefined,
                hubId: 'hubid',
            })
        });
    });

    it('puts the successful action', () => {
        const success = sagaGenerator.clone();
        expect(success.next(authRules)).toEqual({
            done: false,
            value: put(getIoTHubKeyAction.done({
                params,
                result: formatConnectionString(params.hubName, authRules[0])
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
                    translationKey: ResourceKeys.authentication.azureActiveDirectory.notification.getIotHubKeyError,
                    translationOptions: {error: 'error'}
                },
                type: NotificationType.error
              })
        });

        expect(failure.next(error)).toEqual({
            done: false,
            value: put(getIoTHubKeyAction.failed({
                error,
                params
            }))
        });
        expect(failure.next().done).toEqual(true);
    });
});
