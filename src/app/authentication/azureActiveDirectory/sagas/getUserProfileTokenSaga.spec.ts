/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { cloneableGenerator } from '@redux-saga/testing-utils';
import { put, call } from 'redux-saga/effects';
import { getUserProfileTokenAction } from '../actions';
import { getTokenSaga } from './getUserProfileTokenSaga';
import * as AuthenticationService from '../../../api/services/authenticationService';

 describe('getTokenSaga', () => {

    const mockGetProfileToken = jest.spyOn(AuthenticationService, 'getProfileToken').mockImplementationOnce(() => {
        return 'token';
    });
    const sagaGenerator = cloneableGenerator(getTokenSaga)();

    it('calls getProfileToken', () => {
        expect(sagaGenerator.next()).toEqual({
            done: false,
            value: call(mockGetProfileToken)
        });
    });

    it('puts the successful action', () => {
        const success = sagaGenerator.clone();
        expect(success.next('token')).toEqual({
            done: false,
            value: put(getUserProfileTokenAction.done({
                result: 'token'
            }))
        });
        expect(success.next().done).toEqual(true);
    });

    it('fails on error', () => {
        const failure = sagaGenerator.clone();
        const error = { code: -1 };
        expect(failure.throw(error)).toEqual({
            done: false,
            value: put(getUserProfileTokenAction.failed({
                error
            }))
        });
        expect(failure.next().done).toEqual(true);
    });
});
