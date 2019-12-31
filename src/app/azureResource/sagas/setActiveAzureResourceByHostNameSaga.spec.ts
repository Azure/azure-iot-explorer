/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { call, put, select } from 'redux-saga/effects';
import { cloneableGenerator } from 'redux-saga/utils';
import { setActiveAzureResourceByHostNameSaga } from './setActiveAzureResourceByHostNameSaga';
import { setActiveAzureResourceByHostNameAction, SetActiveAzureResourceByHostNameActionParameters, setActiveAzureResourceAction } from '../actions';
import { AccessVerificationState } from '../models/accessVerificationState';
import { getConnectionStringSelector } from '../../login/selectors';
import { getConnectionInfoFromConnectionString } from '../../api/shared/utils';

describe('setActiveAzureResourceByHostNameSaga', () => {
    const parameters: SetActiveAzureResourceByHostNameActionParameters = {
        hostName: 'hostname'
    };
    const setActiveAzureResourceByHostNameSagaGenerator = cloneableGenerator(setActiveAzureResourceByHostNameSaga)(setActiveAzureResourceByHostNameAction(parameters));

    it('yields selector to get current connection string', () => {
        expect(setActiveAzureResourceByHostNameSagaGenerator.next()).toEqual({
            done: false,
            value: select(getConnectionStringSelector)
        });
    });

    it('yields call to get host name from connection string', () => {
        expect(setActiveAzureResourceByHostNameSagaGenerator.next('connectionString')).toEqual({
            done: false,
            value: call(getConnectionInfoFromConnectionString, 'connectionString')
        });
    });

    describe('host name matches', () => {
        const cloneSagaGenerator = setActiveAzureResourceByHostNameSagaGenerator.clone();
        cloneSagaGenerator.next();
        cloneSagaGenerator.next('connectionString');
        it('yields put effect to set active resource', () => {
            expect(cloneSagaGenerator.next({ hostName: 'hostname'})).toEqual({
                done: false,
                value: put(setActiveAzureResourceAction({
                    accessVerificationState: AccessVerificationState.Authorized,
                    connectionString: 'connectionString',
                    hostName: 'hostname'
                }))
            });
        });

        it('finishes', () => {
            expect(cloneSagaGenerator.next()).toEqual({
                done: true
            });
        });
    });

    describe('host name does not match', () => {
        const cloneSagaGenerator = setActiveAzureResourceByHostNameSagaGenerator.clone();
        cloneSagaGenerator.next();
        cloneSagaGenerator.next('connectionStirng');
        it('yields put effect to set active resource', () => {
            expect(cloneSagaGenerator.next({ hostName: 'nothostname'})).toEqual({
                done: false,
                value: put(setActiveAzureResourceAction({
                    accessVerificationState: AccessVerificationState.Unauthorized,
                    hostName: 'hostname'
                }))
            });
        });

        it('finishes', () => {
            expect(cloneSagaGenerator.next()).toEqual({
                done: true
            });
        });
    });
});
