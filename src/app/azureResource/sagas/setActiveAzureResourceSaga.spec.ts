/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { put } from 'redux-saga/effects';
import { cloneableGenerator } from 'redux-saga/utils';
import { setActiveAzureResourceSaga } from './setActiveAzureResourceSaga';
import { setActiveAzureResourceAction } from '../actions';
import { AzureResource } from '../models/azureResource';
import { AccessVerificationState } from '../models/accessVerificationState';
import { clearDevicesAction } from '../../devices/deviceList/actions';
import { clearModelDefinitionsAction } from '../../devices/deviceContent/actions';

describe('setActiveAzureResourceSaga', () => {
    const resource: AzureResource = {
        accessVerificationState: AccessVerificationState.Authorized,
        hostName: 'hostname'
    };
    const setActiveAzureResourceSagaGenerator = cloneableGenerator(setActiveAzureResourceSaga)(setActiveAzureResourceAction(resource));

    it('returns put effect to clear devices', () => {
        expect(setActiveAzureResourceSagaGenerator.next()).toEqual({
            done: false,
            value: put(clearDevicesAction())
        });
    });

    it('returns put effect to clear model definitions', () => {
        expect(setActiveAzureResourceSagaGenerator.next()).toEqual({
            done: false,
            value: put(clearModelDefinitionsAction())
        });
    });

    it('finishes', () => {
        expect(setActiveAzureResourceSagaGenerator.next()).toEqual({
            done: true
        });
    });
 });
