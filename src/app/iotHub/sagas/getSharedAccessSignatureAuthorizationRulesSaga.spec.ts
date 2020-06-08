/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { select, call, put } from 'redux-saga/effects';
import { Map } from 'immutable';
import { getSharedAccessSignatureAuthorizationRulesSaga, getSharedAccessSignatureAuthorizationRulesCache, getAzureResourceManagementEndpoint, cacheRetentionInMilliseconds } from './getSharedAccessSignatureAuthorizationRulesSaga';
import { CacheWrapper } from '../../api/models/cacheWrapper';
import { SharedAccessSignatureAuthorizationRule } from '../models/sharedAccessSignatureAuthorizationRule';
import { AccessRights } from '../models/accessRights';
import { appConfig } from '../../../appConfig/appConfig';
import { executeAzureResourceManagementTokenRequest } from '../../login/services/authService';
import { getSharedAccessSignatureAuthorizationRules } from '../services/iotHubService';
import { setSharedAccessSignatureAuthorizationRulesAction } from '../actions';

describe('getSharedAccessSignatureAuthorizationRulesSaga', () => {
    const resourceIdentifier = {
        id: '/resourceId',
        location: 'loc1',
        name: 'name1',
        resourceGroup: 'resourceGroup1',
        subscriptionId: 'sub1',
        type: 'type1'
    };
    const epoch = 100;
    const cacheEntry = {
        lastSynchronized: epoch,
        payload: [
            {
                keyName: 'keyName1',
                primaryKey: 'pk1',
                rights: AccessRights.ServiceConnectDeviceConnect,
                secondaryKey: 'sk1'
            }
        ]
    };

    describe('valid cached scenario', () => {
        const saga = getSharedAccessSignatureAuthorizationRulesSaga(resourceIdentifier);

        it('returns select effect to getSharedAccessSignatureAuthorizationRulesCache', () => {
            expect(saga.next()).toEqual({
                done: false,
                value: select(getSharedAccessSignatureAuthorizationRulesCache)
            });
        });

        it('returns the cached payload', () => {
            const cache = Map<string, CacheWrapper<SharedAccessSignatureAuthorizationRule[]>>([[resourceIdentifier.name, cacheEntry]]);
            const mock = jest.spyOn(Date, 'now');
            mock.mockReturnValue(epoch);

            expect(saga.next(cache)).toEqual({
                done: true,
                value: cacheEntry.payload
            });
        });
    });

    describe('expired cache scenario', () => {
        const saga = getSharedAccessSignatureAuthorizationRulesSaga(resourceIdentifier);
        const endpoint = 'endpoint1';
        const authorizationToken = 'accessToken1';

        it('returns select effect to getSharedAccessSignatureAuthorizationRulesCache', () => {
            expect(saga.next()).toEqual({
                done: false,
                value: select(getSharedAccessSignatureAuthorizationRulesCache)
            });
        });

        it('returns call effect to getAzureResourceManagementEndpoint', () => {
            const cache = Map<string, CacheWrapper<SharedAccessSignatureAuthorizationRule[]>>([[resourceIdentifier.name, cacheEntry]]);
            const mock = jest.spyOn(Date, 'now');
            mock.mockReturnValue(epoch + cacheRetentionInMilliseconds + 1);

            expect(saga.next(cache)).toEqual({
                done: false,
                value: call(getAzureResourceManagementEndpoint)
            });
        });

        it('returns call effect to getAuthorizationToken', () => {
            expect(saga.next(endpoint)).toEqual({
                done: false,
                value: call(executeAzureResourceManagementTokenRequest, )
            });
        });

        it('returns call effect to getSharedAccessSignatureAuthorizationRules', () => {
            expect(saga.next(authorizationToken)).toEqual({
                done: false,
                value: call(getSharedAccessSignatureAuthorizationRules, {
                    azureResourceIdentifier: resourceIdentifier,
                    azureResourceManagementEndpoint: {
                        authorizationToken,
                        endpoint
                    }
                })
            });
        });

        it('returns put effect to setSharedAccessSignatureAuthorizationRules', () => {
            expect(saga.next(cacheEntry.payload)).toEqual({
                done: false,
                value: put(setSharedAccessSignatureAuthorizationRulesAction({
                    hubName: resourceIdentifier.name,
                    sharedAccessSignatureAuthorizationRules: cacheEntry.payload
                }))
            });
        });

        it('returns cached payload', () => {
            expect(saga.next()).toEqual({
                done: true,
                value: cacheEntry.payload
            });
        });
    });
});

describe('getAzureResourceManagementEndpoint', () => {
    it('returns expected value', () => {
        const endpoint = appConfig.azureResourceManagementEndpoint;
        expect(getAzureResourceManagementEndpoint()).toEqual(endpoint);
    });
});

describe('getSharedAccessSignatureAuthorizationRulesCache', () => {
    it('returns expected state element', () => {
        const cacheEntry = {
            lastSynchronized: 100,
            payload: []
        };

        const state = {
            sharedAccessSignatureAuthorizationRules: Map<string, CacheWrapper<SharedAccessSignatureAuthorizationRule[]>>([['hub1', cacheEntry]])
        };

        const result = getSharedAccessSignatureAuthorizationRulesCache(state);
        expect(result.has('hub1')).toEqual(true);
        expect(result.get('hub1')).toEqual(cacheEntry);
    });
});
