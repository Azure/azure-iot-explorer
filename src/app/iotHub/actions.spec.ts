/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import {
   setSharedAccessSignatureAuthorizationRulesAction
} from './actions';

describe('setSharedAccessSignatureAuthorizationRules', () => {
    it('returns IOT_HUB/SET_SAS action object', () => {
        expect(setSharedAccessSignatureAuthorizationRulesAction({ hubName: '', sharedAccessSignatureAuthorizationRules: []})).toEqual({
            payload: {
                hubName: '',
                sharedAccessSignatureAuthorizationRules: []
            },
            type: 'IOT_HUB/SET_SAS'
        });
    });
});
