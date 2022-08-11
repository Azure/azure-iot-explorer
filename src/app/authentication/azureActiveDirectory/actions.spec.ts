/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
 import { getUserProfileTokenAction, loginAction, logoutAction } from './actions';

describe('actions', () => {
    context('getUserProfileTokenAction', () => {

        it('returns AAD/GET_TOKEN_STARTED action object', () => {
            expect(getUserProfileTokenAction.started().type).toEqual('AAD/GET_TOKEN_STARTED');
        });

        it('returns AAD/GET_TOKEN_DONE action object', () => {
            expect(getUserProfileTokenAction.done({result: 'token'}).type).toEqual('AAD/GET_TOKEN_DONE');
        });

        it('returns AAD/GET_TOKEN_FAILED action object', () => {
            expect(getUserProfileTokenAction.failed({error: {}}).type).toEqual('AAD/GET_TOKEN_FAILED');
        });
    });

    context('loginAction', () => {

        it('returns AAD/LOGIN_STARTED action object', () => {
            expect(loginAction.started().type).toEqual('AAD/LOGIN_STARTED');
        });

        it('returns AAD/LOGIN_DONE action object', () => {
            expect(loginAction.done({}).type).toEqual('AAD/LOGIN_DONE');
        });

        it('returns AAD/LOGIN_FAILED action object', () => {
            expect(loginAction.failed({error: {}}).type).toEqual('AAD/LOGIN_FAILED');
        });
    });

    context('logoutAction', () => {

        it('returns AAD/LOGOUT_STARTED action object', () => {
            expect(logoutAction.started().type).toEqual('AAD/LOGOUT_STARTED');
        });

        it('returns AAD/LOGOUT_DONE action object', () => {
            expect(logoutAction.done({}).type).toEqual('AAD/LOGOUT_DONE');
        });

        it('returns AAD/LOGOUT_FAILED action object', () => {
            expect(logoutAction.failed({error: {}}).type).toEqual('AAD/LOGOUT_FAILED');
        });
    });
});
