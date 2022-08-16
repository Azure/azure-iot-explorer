/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { azureActiveDirectoryReducer } from './reducers';
import { loginAction, logoutAction, getIotHubsBySubscriptionAction, getSubscriptionListAction, getUserProfileTokenAction, getIoTHubKeyAction } from './actions';
import { getInitialAzureActiveDirectoryState } from './state';
import { SubscriptionState } from '../../api/models/azureSubscription';

describe('azureActiveDirectoryReducer', () => {
    context('AAD/GET_IOTHUBS', () => {
        it('handles AAD/GET_IOTHUBS_STARTED action', ()=> {
            const action = getIotHubsBySubscriptionAction.started('subscriptionId');
            expect(azureActiveDirectoryReducer(getInitialAzureActiveDirectoryState(), action).formState).toEqual('working');
        });

        it('handles AAD/GET_IOTHUBS_DONE action', ()=> {
            const iotHub = {
                name: 'hub',
                location: 'westus',
                id: 'id'
            }
            const action = getIotHubsBySubscriptionAction.done({params: 'subscriptionId', result: [iotHub]});
            expect(azureActiveDirectoryReducer(getInitialAzureActiveDirectoryState(), action)).toEqual({
                ...getInitialAzureActiveDirectoryState(),
                formState: 'idle',
                iotHubs: [iotHub]
            });
        });

        it('handles AAD/GET_IOTHUBS_FAILED action', ()=> {
            const action = getIotHubsBySubscriptionAction.failed({params: 'subscriptionId', error: {}});
            expect(azureActiveDirectoryReducer(getInitialAzureActiveDirectoryState(), action).formState).toEqual('failed');
        });
    });

    context('AAD/GET_SUBSCRIPTIONS', () => {
        it('handles AAD/GET_SUBSCRIPTIONS_STARTED action', ()=> {
            const action = getSubscriptionListAction.started();
            expect(azureActiveDirectoryReducer(getInitialAzureActiveDirectoryState(), action).formState).toEqual('working');
        });

        it('handles AAD/GET_SUBSCRIPTIONS_DONE action', ()=> {
            const sub = {
                displayName: 'test',
                id: 'id',
                tenantId: 'id',
                state: SubscriptionState.Disabled,
                subscriptionId: 'id'
            }
            const action = getSubscriptionListAction.done({result: [sub]});
            expect(azureActiveDirectoryReducer(getInitialAzureActiveDirectoryState(), action)).toEqual({
                ...getInitialAzureActiveDirectoryState(),
                formState: 'idle',
                subscriptions: [sub]
            });
        });

        it('handles AAD/GET_SUBSCRIPTIONS_FAILED action', ()=> {
            const action = getSubscriptionListAction.failed({error: {}});
            expect(azureActiveDirectoryReducer(getInitialAzureActiveDirectoryState(), action).formState).toEqual('failed');
        });
    });

    context('AAD/GET_TOKEN', () => {
        it('handles AAD/GET_TOKEN_STARTED action', ()=> {
            const action = getUserProfileTokenAction.started();
            expect(azureActiveDirectoryReducer(getInitialAzureActiveDirectoryState(), action).formState).toEqual('working');
        });

        it('handles AAD/GET_TOKEN_DONE action', ()=> {
            const action = getUserProfileTokenAction.done({result: 'token'});
            expect(azureActiveDirectoryReducer(getInitialAzureActiveDirectoryState(), action)).toEqual({
                ...getInitialAzureActiveDirectoryState(),
                formState: 'idle',
                token: 'token'
            });
        });

        it('handles AAD/GET_TOKEN_FAILED action', ()=> {
            const action = getUserProfileTokenAction.failed({error: {}});
            expect(azureActiveDirectoryReducer(getInitialAzureActiveDirectoryState(), action).formState).toEqual('failed');
        });
    });

    context('AAD/GET_HUBKEY', () => {
        const params = {hubId: 'hubid', hubName: 'test'};
        it('handles AAD/GET_HUBKEY_STARTED action', ()=> {
            const action = getIoTHubKeyAction.started(params);
            expect(azureActiveDirectoryReducer(getInitialAzureActiveDirectoryState(), action).formState).toEqual('working');
        });

        it('handles AAD/GET_HUBKEY_DONE action', ()=> {
            const action = getIoTHubKeyAction.done({params, result: 'key'});
            expect(azureActiveDirectoryReducer(getInitialAzureActiveDirectoryState(), action)).toEqual({
                ...getInitialAzureActiveDirectoryState(),
                formState: 'keyPicked',
                iotHubKey: 'key'
            });
        });

        it('handles AAD/GET_HUBKEY_FAILED action', ()=> {
            const action = getIoTHubKeyAction.failed({params, error: {}});
            expect(azureActiveDirectoryReducer(getInitialAzureActiveDirectoryState(), action).formState).toEqual('failed');
        });
    });

    context('AAD/LOGIN', () => {
        it('handles AAD/LOGIN_STARTED action', ()=> {
            const action = loginAction.started();
            expect(azureActiveDirectoryReducer(getInitialAzureActiveDirectoryState(), action).formState).toEqual('working');
        });

        it('handles AAD/LOGIN_DONE action', ()=> {
            const action = loginAction.done({});
            expect(azureActiveDirectoryReducer(getInitialAzureActiveDirectoryState(), action).formState).toEqual('idle');
        });

        it('handles AAD/LOGIN_FAILED action', ()=> {
            const action = loginAction.failed({error: {}});
            expect(azureActiveDirectoryReducer(getInitialAzureActiveDirectoryState(), action).formState).toEqual('failed');
        });
    });

    context('AAD/LOGOUT', () => {
        it('handles AAD/LOGOUT_STARTED action', ()=> {
            const action = logoutAction.started();
            expect(azureActiveDirectoryReducer(getInitialAzureActiveDirectoryState(), action).formState).toEqual('working');
        });

        it('handles AAD/LOGOUT_DONE action', ()=> {
            const action = logoutAction.done({});
            expect(azureActiveDirectoryReducer(getInitialAzureActiveDirectoryState(), action).formState).toEqual('idle');
        });

        it('handles AAD/LOGOUT_FAILED action', ()=> {
            const action = logoutAction.failed({error: {}});
            expect(azureActiveDirectoryReducer(getInitialAzureActiveDirectoryState(), action).formState).toEqual('failed');
        });
    });
});

