/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { cloneableGenerator } from '@redux-saga/testing-utils';
import { put, call } from 'redux-saga/effects';
import { logoutAction } from '../actions';
import { logoutSaga } from './logoutSaga';
import * as AuthenticationService from '../../../api/services/authenticationService';
import { raiseNotificationToast } from '../../../notifications/components/notificationToast';
import { ResourceKeys } from '../../../../localization/resourceKeys';
import { NotificationType } from '../../../api/models/notification';

 describe('logoutSaga', () => {

    const mockLogout = jest.spyOn(AuthenticationService, 'logout').mockImplementationOnce(() => {
        return null;
    });
    const sagaGenerator = cloneableGenerator(logoutSaga)();

    it('calls logout', () => {
        expect(sagaGenerator.next()).toEqual({
            done: false,
            value: call(mockLogout)
        });
    });

    it('puts the successful action', () => {
        const success = sagaGenerator.clone();
        expect(success.next()).toEqual({
            done: false,
            value: put(logoutAction.done({}))
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
                    translationKey: ResourceKeys.authentication.azureActiveDirectory.notification.logoutError,
                },
                type: NotificationType.error
              })
        });

        expect(failure.next(error)).toEqual({
            done: false,
            value: put(logoutAction.failed({
                error
            }))
        });
        expect(failure.next().done).toEqual(true);
    });
});
