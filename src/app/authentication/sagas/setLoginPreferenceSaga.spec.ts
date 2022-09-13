/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { cloneableGenerator } from '@redux-saga/testing-utils';
import { put } from 'redux-saga/effects';
import { AUTHENTICATION_METHOD_PREFERENCE } from '../../constants/browserStorage';
import { setLoginPreferenceAction } from '../actions';
import { setLoginPreferenceSaga } from './setLoginPreferenceSaga';

 describe('setLoginPreferenceSaga', () => {
    it('sets login preference', () => {
        const sagaGenerator = cloneableGenerator(setLoginPreferenceSaga)(setLoginPreferenceAction.started('aad'));
        localStorage.setItem(AUTHENTICATION_METHOD_PREFERENCE, '');

        expect(sagaGenerator.next()).toEqual({
            done: false,
            value: put(setLoginPreferenceAction.done({params: 'aad'}))
        });
        expect(sagaGenerator.next().done).toEqual(true);
        expect(localStorage.getItem(AUTHENTICATION_METHOD_PREFERENCE)).toEqual('aad');
    });
});
