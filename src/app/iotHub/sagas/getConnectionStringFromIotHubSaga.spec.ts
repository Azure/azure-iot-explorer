/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { call } from 'redux-saga/effects';
import { getConnectionStringFromIotHubSaga } from './getConnectionStringFromIotHubSaga';
import { AzureResourceIdentifier } from '../../azureResourceIdentifier/models/azureResourceIdentifier';
import { AzureResourceIdentifierType } from '../../azureResourceIdentifier/models/azureResourceIdentifierType';
import { getSharedAccessSignatureAuthorizationRulesSaga } from './getSharedAccessSignatureAuthorizationRulesSaga';
import { ERROR_TYPES } from '../../api/constants';

describe('getConnectionStringFromIotHubSaga', () => {
    const azureResourceIdentifier: AzureResourceIdentifier = {
        id: 'id1',
        location: 'location1',
        name: 'name1',
        resourceGroup: 'resourceGroup1',
        subscriptionId: 'sub1',
        type: AzureResourceIdentifierType.IotHub
    };

    describe('rule not found case', () => {
        const saga = getConnectionStringFromIotHubSaga(azureResourceIdentifier);

        it('yields call effect to getSharedAccessSignatureAuthorizationRulesSaga', () => {
            expect(saga.next()).toEqual({
                done: false,
                value: call(getSharedAccessSignatureAuthorizationRulesSaga, azureResourceIdentifier)
            });
        });

        it('throws new authorizationRuleNotFound error when a suitable match not found', () => {
            const resultSet = [];

            try {
                saga.next(resultSet);
                expect(true).toEqual(false); // fail test if exception not thrown;
            } catch (e) {
                expect(e.type === ERROR_TYPES.AUTHORIZATION_RULE_NOT_FOUND)
            }
        });
    });

    // describe('matching rule found case', () => {

    // })
});
