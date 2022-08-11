/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { cloneableGenerator } from '@redux-saga/testing-utils';
import { put, call } from 'redux-saga/effects';
import { loginAction } from '../actions';
import { loginSaga } from './loginSaga';
import * as AuthenticationService from '../../../api/services/authenticationService';
import { raiseNotificationToast } from '../../../notifications/components/notificationToast';
import { ResourceKeys } from '../../../../localization/resourceKeys';
import { NotificationType } from '../../../api/models/notification';

 describe('loginSaga', () => {

    const mockLogin = jest.spyOn(AuthenticationService, 'login').mockImplementationOnce(() => {
        return null;
    });
    const sagaGenerator = cloneableGenerator(loginSaga)();

    it('calls login', () => {
        expect(sagaGenerator.next()).toEqual({
            done: false,
            value: call(mockLogin)
        });
    });

    it('puts the successful action', () => {
        const success = sagaGenerator.clone();
        expect(success.next()).toEqual({
            done: false,
            value: put(loginAction.done({}))
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
                    translationKey: ResourceKeys.authentication.azureActiveDirectory.notification.loginError,
                },
                type: NotificationType.error
              })
        });

        expect(failure.next(error)).toEqual({
            done: false,
            value: put(loginAction.failed({
                error
            }))
        });
        expect(failure.next().done).toEqual(true);
    });
});
