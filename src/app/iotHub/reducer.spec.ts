/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { Map } from 'immutable';
import reducer from './reducer';
import { setSharedAccessSignatureAuthorizationRulesAction } from './actions';
import { SharedAccessSignatureAuthorizationRule } from './models/sharedAccessSignatureAuthorizationRule';
import { CacheWrapper } from '../api/models/cacheWrapper';
import { AccessRights } from './models/accessRights';

describe('setSharedAccessSignatureAuthorizationRulesAction', () => {
    it('sets the entry for a specified hub name', () => {
        const initialState = {
            sharedAccessSignatureAuthorizationRules: Map<string, CacheWrapper<SharedAccessSignatureAuthorizationRule[]>>()
        };

        const hubName = 'hubName1';
        const sharedAccessSignatureAuthorizationRules = [
            {
                keyName: 'keyName1',
                primaryKey: 'pk1',
                rights: AccessRights.DeviceConnect,
                secondaryKey: 'sk1'
            },
            {
                keyName: 'keyName2',
                primaryKey: 'pk2',
                rights: AccessRights.ServiceConnect,
                secondaryKey: 'sk2'
            }
        ];

        const mock = jest.spyOn(Date, 'now');
        mock.mockReturnValue(1);

        const result = reducer(initialState, setSharedAccessSignatureAuthorizationRulesAction({ hubName, sharedAccessSignatureAuthorizationRules }));
        expect(result.sharedAccessSignatureAuthorizationRules.has(hubName));
        expect(result.sharedAccessSignatureAuthorizationRules.get(hubName).lastSynchronized).toEqual(1);
        expect(result.sharedAccessSignatureAuthorizationRules.get(hubName).payload).toEqual(sharedAccessSignatureAuthorizationRules);
    });
});
