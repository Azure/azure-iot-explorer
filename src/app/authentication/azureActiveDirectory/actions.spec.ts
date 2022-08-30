/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { getUserProfileTokenAction, getSubscriptionListAction, getIotHubsBySubscriptionAction, loginAction, logoutAction, getIoTHubKeyAction } from './actions';

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

    context('getSubscriptionListAction', () => {

        it('returns AAD/GET_SUBSCRIPTIONS_STARTED action object', () => {
            expect(getSubscriptionListAction.started().type).toEqual('AAD/GET_SUBSCRIPTIONS_STARTED');
        });

        it('returns AAD/GET_SUBSCRIPTIONS_DONE action object', () => {
            expect(getSubscriptionListAction.done({result: []}).type).toEqual('AAD/GET_SUBSCRIPTIONS_DONE');
        });

        it('returns AAD/GET_SUBSCRIPTIONS_FAILED action object', () => {
            expect(getSubscriptionListAction.failed({error: {}}).type).toEqual('AAD/GET_SUBSCRIPTIONS_FAILED');
        });
    });

    context('getIotHubsBySubscriptionAction', () => {

        it('returns AAD/GET_IOTHUBS_STARTED action object', () => {
            expect(getIotHubsBySubscriptionAction.started('subscriptionId').type).toEqual('AAD/GET_IOTHUBS_STARTED');
        });

        it('returns AAD/GET_IOTHUBS_DONE action object', () => {
            expect(getIotHubsBySubscriptionAction.done({params: 'subscriptionId', result: []}).type).toEqual('AAD/GET_IOTHUBS_DONE');
        });

        it('returns AAD/GET_IOTHUBS_FAILED action object', () => {
            expect(getIotHubsBySubscriptionAction.failed({params: 'subscriptionId', error: {}}).type).toEqual('AAD/GET_IOTHUBS_FAILED');
        });
    });

    context('getIoTHubKeyAction', () => {

        const params = {hubId: 'hubid', hubName: 'test'};
        it('returns AAD/GET_HUBKEYSTARTED action object', () => {
            expect(getIoTHubKeyAction.started(params).type).toEqual('AAD/GET_HUBKEY_STARTED');
        });

        it('returns AAD/GET_HUBKEY_DONE action object', () => {
            expect(getIoTHubKeyAction.done({params, result: 'key'}).type).toEqual('AAD/GET_HUBKEY_DONE');
        });

        it('returns AAD/GET_HUBKEY_FAILED action object', () => {
            expect(getIoTHubKeyAction.failed({params, error: {}}).type).toEqual('AAD/GET_HUBKEY_FAILED');
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
