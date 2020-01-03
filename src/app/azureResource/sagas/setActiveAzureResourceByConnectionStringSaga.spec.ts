/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { put } from 'redux-saga/effects';
import { cloneableGenerator } from 'redux-saga/utils';
import { setActiveAzureResourceByConnectionStringSaga } from './setActiveAzureResourceByConnectionStringSaga';
import { setActiveAzureResourceByConnectionStringAction, SetActiveAzureResourceByConnectionStringActionParameters , setActiveAzureResourceAction } from '../actions';
import { AccessVerificationState } from '../models/accessVerificationState';

describe('setActiveAzureResourceByConnectionStringSaga', () => {
    const parameters: SetActiveAzureResourceByConnectionStringActionParameters = {
        connectionString: 'connectionString',
        hostName: 'hostname'
    };
    const setActiveAzureResourceByConnectionStringSagaGenerator = cloneableGenerator(setActiveAzureResourceByConnectionStringSaga)(setActiveAzureResourceByConnectionStringAction(parameters));
    it('yields put effect to setActiveAzureResourceAction', () => {
        expect(setActiveAzureResourceByConnectionStringSagaGenerator.next()).toEqual({
            done: false,
            value: put(setActiveAzureResourceAction({
                accessVerificationState: AccessVerificationState.Authorized,
                connectionString: 'connectionString',
                hostName: 'hostname',
            }))
        });
    });

    it ('finishes', () => {
        expect(setActiveAzureResourceByConnectionStringSagaGenerator.next()).toEqual({
            done: true,
        });
    });
});
