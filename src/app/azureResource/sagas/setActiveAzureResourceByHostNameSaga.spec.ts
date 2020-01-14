/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { call, put, select } from 'redux-saga/effects';
import {
    setActiveAzureResourceByHostNameSaga,
    setActiveAzureResourceByHostNameSaga_ConnectionString,
    setActiveAzureResourceByHostNameSaga_ImplicitFlow,
    getLastUsedConnectionString } from './setActiveAzureResourceByHostNameSaga';
import { setActiveAzureResourceByHostNameAction, SetActiveAzureResourceByHostNameActionParameters, setActiveAzureResourceAction } from '../actions';
import { AccessVerificationState } from '../models/accessVerificationState';
import { tryGetHostNameFromConnectionString } from '../../api/shared/hostNameUtils';
import { appConfig, AuthMode } from '../../../appConfig/appConfig';

describe('setActiveAzureResourceByHostNameSaga', () => {
    const parameters: SetActiveAzureResourceByHostNameActionParameters = {
        hostName: 'hostname'
    };

    describe('empty host name scenario', () => {
        const saga = setActiveAzureResourceByHostNameSaga(setActiveAzureResourceByHostNameAction({ hostName: ''}));

        it('yields put effect to set active azure resource', () => {
            expect(saga.next()).toEqual({
                done: false,
                value: put(setActiveAzureResourceAction({
                    accessVerificationState: AccessVerificationState.Failed,
                    hostName: ''
                }))
            });
        });

        it('finishes', () => {
            expect(saga.next()).toEqual({
                done: true
            });
        });
    });

    describe('connection string auth scenario', () => {
        appConfig.authMode = AuthMode.ConnectionString;
        const saga = setActiveAzureResourceByHostNameSaga(setActiveAzureResourceByHostNameAction(parameters));

        it('yields call effect to setActiveAzureResourceByHostNameSaga_ConnectionString', () => {
            expect(saga.next()).toEqual({
                done: false,
                value: call(setActiveAzureResourceByHostNameSaga_ConnectionString, parameters.hostName)
            });
        });

        it('finishes', () => {
            expect(saga.next()).toEqual({
                done: true
            });
        });
    });

    describe('implicitFlow scenario', () => {
        appConfig.authMode = AuthMode.ImplicitFlow;
        const saga = setActiveAzureResourceByHostNameSaga(setActiveAzureResourceByHostNameAction(parameters));

        it('yields call effect to setActiveAzureResourceByHostNameSaga_ImplicitFlow', () => {
            expect(saga.next()).toEqual({
                done: false,
                value: call(setActiveAzureResourceByHostNameSaga_ImplicitFlow, parameters.hostName)
            });
        });

        it('finishes', () => {
            expect(saga.next()).toEqual({
                done: true
            });
        });
    });
});

describe('setActiveAzureResourceByHostNameSaga_ConnectionString', () => {
    const setActiveAzureResourceByHostNameSagaConnectionString = setActiveAzureResourceByHostNameSaga_ConnectionString('hostName');

    it('yields selector to get current connection string', () => {
        expect(setActiveAzureResourceByHostNameSagaConnectionString.next()).toEqual({
            done: false,
            value: select(getLastUsedConnectionString)
        });
    });

    it('yields call to tryGetHostName from connection string', () => {
        expect(setActiveAzureResourceByHostNameSagaConnectionString.next('connectionString')).toEqual({
            done: false,
            value: call(tryGetHostNameFromConnectionString, 'connectionString')
        });
    });

    describe('host name matches', () => {
        const saga = setActiveAzureResourceByHostNameSaga_ConnectionString('hostName');
        saga.next();
        saga.next('connectionString');
        it('yields put effect to set active resource', () => {
            expect(saga.next('hostname')).toEqual({
                done: false,
                value: put(setActiveAzureResourceAction({
                    accessVerificationState: AccessVerificationState.Authorized,
                    connectionString: 'connectionString',
                    hostName: 'hostName'
                }))
            });
        });

        it('finishes', () => {
            expect(saga.next()).toEqual({
                done: true
            });
        });
    });

    describe('host name does not match', () => {
        const saga = setActiveAzureResourceByHostNameSaga_ConnectionString('hostName');
        saga.next();
        saga.next(undefined);
        it('yields put effect to set active resource', () => {
            expect(saga.next('')).toEqual({
                done: false,
                value: put(setActiveAzureResourceAction({
                    accessVerificationState: AccessVerificationState.Unauthorized,
                    hostName: 'hostName'
                }))
            });
        });

        it('finishes', () => {
            expect(saga.next()).toEqual({
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
