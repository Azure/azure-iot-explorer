/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
 import { setLoginPreferenceAction,  getLoginPreferenceAction } from './actions';

describe('actions', () => {
    context('setLoginPreferenceAction', () => {

        it('returns AUTHENTICATION/SET_STARTED action object', () => {
            expect(setLoginPreferenceAction.started('').type).toEqual('AUTHENTICATION/SET_STARTED');
        });

        it('returns AUTHENTICATION/SET_DONE action object', () => {
            expect(setLoginPreferenceAction.done({params: ''}).type).toEqual('AUTHENTICATION/SET_DONE');
        });

        it('returns AUTHENTICATION/SET_FAILED action object', () => {
            expect(setLoginPreferenceAction.failed({params: '', error: {}}).type).toEqual('AUTHENTICATION/SET_FAILED');
        });
    });

    context('getLoginPreferenceAction', () => {

        it('returns AUTHENTICATION/GET_STARTED action object', () => {
            expect(getLoginPreferenceAction.started().type).toEqual('AUTHENTICATION/GET_STARTED');
        });

        it('returns AUTHENTICATION/GET_DONE action object', () => {
            expect(getLoginPreferenceAction.done({result: ''}).type).toEqual('AUTHENTICATION/GET_DONE');
        });

        it('returns AUTHENTICATION/GET_FAILED action object', () => {
            expect(getLoginPreferenceAction.failed({error: {}}).type).toEqual('AUTHENTICATION/GET_FAILED');
        });
    });
});
