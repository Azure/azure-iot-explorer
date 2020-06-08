/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { put, call } from 'redux-saga/effects';
// tslint:disable-next-line: no-implicit-dependencies
import { cloneableGenerator } from '@redux-saga/testing-utils';
import { setActiveAzureResourceSaga, setActiveConnectionString } from './setActiveAzureResourceSaga';
import { setActiveAzureResourceAction } from '../actions';
import { AzureResource } from '../models/azureResource';
import { AccessVerificationState } from '../models/accessVerificationState';

describe('setActiveAzureResourceSaga', () => {
    const resource: AzureResource = {
        accessVerificationState: AccessVerificationState.Authorized,
        connectionString: 'connectionString',
        hostName: 'hostname',
    };
    const setActiveAzureResourceSagaGenerator = cloneableGenerator(setActiveAzureResourceSaga)(setActiveAzureResourceAction(resource));

    it('returns call effect to set connection strings', () => {
        expect(setActiveAzureResourceSagaGenerator.next()).toEqual({
            done: false,
            value: call(setActiveConnectionString, 'connectionString')
        });
    });

    it('finishes', () => {
        expect(setActiveAzureResourceSagaGenerator.next()).toEqual({
            done: true
        });
    });
 });
