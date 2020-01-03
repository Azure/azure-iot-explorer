/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { call, put, select } from 'redux-saga/effects';
import { cloneableGenerator } from 'redux-saga/utils';
import { setActiveAzureResourceByHostNameSaga, getLastUsedConnectionString } from './setActiveAzureResourceByHostNameSaga';
import { setActiveAzureResourceByHostNameAction, SetActiveAzureResourceByHostNameActionParameters, setActiveAzureResourceAction } from '../actions';
import { AccessVerificationState } from '../models/accessVerificationState';
import { getConnectionInfoFromConnectionString } from '../../api/shared/utils';

describe('setActiveAzureResourceByHostNameSaga', () => {
    const parameters: SetActiveAzureResourceByHostNameActionParameters = {
        hostName: 'hostname'
    };
    const setActiveAzureResourceByHostNameSagaGenerator = cloneableGenerator(setActiveAzureResourceByHostNameSaga)(setActiveAzureResourceByHostNameAction(parameters));

    it('yields selector to get current connection string', () => {
        expect(setActiveAzureResourceByHostNameSagaGenerator.next()).toEqual({
            done: false,
            value: select(getLastUsedConnectionString)
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
        it('yields put effect to set active resource', () => {
            expect(cloneSagaGenerator.next('')).toEqual({
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

describe('getLastUsedConnectionString', () => {
    it('returns expected value when array has one or more entries', () => {
        const state = {
            connectionStringsState: {
                connectionStrings: ['connection1', 'connection2']
            }
        };

        // tslint:disable-next-line:no-any
        expect(getLastUsedConnectionString(state as any)).toEqual('connection1');
    });

    it('returns expected value when array has no entries', () => {
        const state = {
            connectionStringsState: {
                connectionStrings: []
            }
        };

        // tslint:disable-next-line:no-any
        expect(getLastUsedConnectionString(state as any)).toEqual('');
    });
});
