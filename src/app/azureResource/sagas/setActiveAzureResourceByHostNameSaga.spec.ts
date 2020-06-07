/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { call, put, select } from 'redux-saga/effects';
import {
    setActiveAzureResourceByHostNameSaga,
    setActiveAzureResourceByHostNameSaga_ConnectionString,
    setActiveAzureResourceByHostNameSaga_ImplicitFlow,
    getAuthMode,
    getAzureResourceManagementEndpoint } from './setActiveAzureResourceByHostNameSaga';
import { setActiveAzureResourceByHostNameAction, SetActiveAzureResourceByHostNameActionParameters, setActiveAzureResourceAction } from '../actions';
import { AccessVerificationState } from '../models/accessVerificationState';
import * as hostNameUtils from '../../api/shared/hostNameUtils';
import { appConfig, AuthMode } from '../../../appConfig/appConfig';
import { executeAzureResourceManagementTokenRequest } from '../../login/services/authService';
import { getAzureSubscriptions } from '../../azureResourceIdentifier/services/azureSubscriptionService';
import { getAzureResourceIdentifier } from '../../azureResourceIdentifier/services/azureResourceIdentifierService';
import { AzureResourceIdentifierType } from '../../azureResourceIdentifier/models/azureResourceIdentifierType';
import { ACTIVE_CONNECTION_STRING } from '../../constants/browserStorage';

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
        const saga = setActiveAzureResourceByHostNameSaga(setActiveAzureResourceByHostNameAction(parameters));

        it('yields call effect to get authMode', () => {
            expect(saga.next()).toEqual({
                done: false,
                value: call(getAuthMode)
            });
        });

        it('yields call effect to setActiveAzureResourceByHostNameSaga_ConnectionString', () => {
            expect(saga.next(AuthMode.ConnectionString)).toEqual({
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
        const saga = setActiveAzureResourceByHostNameSaga(setActiveAzureResourceByHostNameAction(parameters));

        it('yields call effect to get authMode', () => {
            expect(saga.next()).toEqual({
                done: false,
                value: call(getAuthMode)
            });
        });

        it('yields call effect to setActiveAzureResourceByHostNameSaga_ImplicitFlow', () => {
            expect(saga.next(AuthMode.ImplicitFlow)).toEqual({
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
            value: call(localStorage.getItem, ACTIVE_CONNECTION_STRING)
        });
    });

    it('yields call to tryGetHostName from connection string', () => {
        expect(setActiveAzureResourceByHostNameSagaConnectionString.next('connectionString')).toEqual({
            done: false,
            value: call(hostNameUtils.tryGetHostNameFromConnectionString, 'connectionString')
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

describe('setActiveAzureResourceByHostNameSaga_ImplicitFlow', () => {
    const endpoint = 'endpoint1';
    const authorizationToken = 'token1';
    const subscriptions = [{ subscriptionId: 'sub1'}, { subscriptionId: 'sub2'}];
    const resourceNameSpy = jest.spyOn(hostNameUtils, 'getResourceNameFromHostName');
    const resourceTypeSpy = jest.spyOn(hostNameUtils, 'getResourceTypeFromHostName');
    const resourceIdentifier = {
        id: 'id1',
        location: 'location1',
        name: 'name1',
        resourceGroup: 'resourceGroup1',
        subscriptionId: 'sub1',
        type: 'type1'
    };

    describe('succss path', () => {
        const saga = setActiveAzureResourceByHostNameSaga_ImplicitFlow('hostName');

        it('yields call effect o get to getAzureResourceManagementEndpoint', () => {
            expect(saga.next()).toEqual({
                done: false,
                value: call(getAzureResourceManagementEndpoint)
            });
        });

        it('yields call effect to executeAzureResourceManagementTokenRequest', () => {
            expect(saga.next(endpoint)).toEqual({
                done: false,
                value: call(executeAzureResourceManagementTokenRequest)
            });
        });

        it('yields call effect to getAzureSubscription', () => {
            expect(saga.next(authorizationToken)).toEqual({
                done: false,
                value: call(getAzureSubscriptions, {
                    azureResourceManagementEndpoint: {
                        authorizationToken,
                        endpoint
                    }
                })
            });
        });

        it ('yields call effect to getAzureResourceIdentifier', () => {
            resourceNameSpy.mockReturnValue('resourceName');
            resourceTypeSpy.mockReturnValue(AzureResourceIdentifierType.IoTHub);
            expect(saga.next(subscriptions)).toEqual({
                done: false,
                value: call(getAzureResourceIdentifier, {
                    azureResourceManagementEndpoint: {
                        authorizationToken,
                        endpoint
                    },
                    resourceName: 'resourceName',
                    resourceType: AzureResourceIdentifierType.IoTHub,
                    subscriptionIds: ['sub1', 'sub2']
                })
            });
        });

        it('yields put effect to setActiveAzureResourceAction', () => {
            expect(saga.next(resourceIdentifier)).toEqual({
                done: false,
                value: put(setActiveAzureResourceAction({
                    accessVerificationState: AccessVerificationState.Authorized,
                    azureResourceIdentifier: resourceIdentifier,
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

    describe('resource not found path', () => {
        const saga = setActiveAzureResourceByHostNameSaga_ImplicitFlow('hostName');
        saga.next();
        saga.next(endpoint);
        saga.next(authorizationToken);
        saga.next(subscriptions);
        expect(saga.next(undefined)).toEqual({
            done: false,
            value: put(setActiveAzureResourceAction({
                accessVerificationState: AccessVerificationState.Unauthorized,
                azureResourceIdentifier: undefined,
                hostName: 'hostName'
            }))
        });
    });

    describe('exception path', () => {
        const saga = setActiveAzureResourceByHostNameSaga_ImplicitFlow('hostName');

        it('yields call effect o get to getAzureResourceManagementEndpoint', () => {
            saga.next();
            expect(saga.throw()).toEqual({
                done: false,
                value: put(setActiveAzureResourceAction({
                    accessVerificationState: AccessVerificationState.Failed,
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

describe('getAuthMode', () => {
    it('returns auth mode', () => {
        const authMode = appConfig.authMode;
        expect(getAuthMode()).toEqual(authMode);
    });
});

describe('getAzureResourceManagementEndpoint', () => {
    it('returns Azure Resource Management Endpoint', () => {
        const endpoint = appConfig.azureResourceManagementEndpoint;
        expect(getAzureResourceManagementEndpoint()).toEqual(endpoint);
    });
});
