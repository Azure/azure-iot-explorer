/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { put } from 'redux-saga/effects';
import { cloneableGenerator } from 'redux-saga/utils';
import { setActiveAzureResourceByHostNameSaga } from './setActiveAzureResourceByHostNameSaga';
import { setActiveAzureResourceByHostNameAction, SetActiveAzureResourceByHostNameActionParameters, setActiveAzureResourceAction } from '../actions';
import { AccessVerificationState } from '../models/accessVerificationState';

describe('setActiveAzureResourceByHostNameSaga', () => {
    const parameters: SetActiveAzureResourceByHostNameActionParameters = {
        hostName: 'hostname'
    };
    const setActiveAzureResourceByHostNameSagaGenerator = cloneableGenerator(setActiveAzureResourceByHostNameSaga)(setActiveAzureResourceByHostNameAction(parameters));
    it('yields put effect to set active resource', () => {
        expect(setActiveAzureResourceByHostNameSagaGenerator.next()).toEqual({
            done: false,
            value: put(setActiveAzureResourceAction({
                accessVerificationState: AccessVerificationState.Unauthorized,
                hostName: 'hostname'
            }))
        });
    });

    it('finishes', () => {
        expect(setActiveAzureResourceByHostNameSagaGenerator.next()).toEqual({
            done: true
        });
    });
});
