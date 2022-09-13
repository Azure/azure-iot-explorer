/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { cloneableGenerator } from '@redux-saga/testing-utils';
import { put } from 'redux-saga/effects';
import { AUTHENTICATION_METHOD_PREFERENCE } from '../../constants/browserStorage';
import { getLoginPreferenceAction } from '../actions';
import { getLoginPreferenceSaga } from './getLoginPreferenceSaga';

 describe('getLoginPreferenceSaga', () => {
    it('gets login preference', () => {
        const sagaGenerator = cloneableGenerator(getLoginPreferenceSaga)();
        localStorage.setItem(AUTHENTICATION_METHOD_PREFERENCE, 'aad');

        expect(sagaGenerator.next('aad')).toEqual({
            done: false,
            value: put(getLoginPreferenceAction.done({result: 'aad'}))
        });
        expect(sagaGenerator.next().done).toEqual(true);
    });
});
