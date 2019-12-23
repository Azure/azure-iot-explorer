/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { put } from 'redux-saga/effects';
import { cloneableGenerator } from 'redux-saga/utils';
import { setActiveAzureResourceByConnectionStringSaga } from './setActiveAzureResourceByConnectionStringSaga';
import { setActiveAzureResourceByConnectionStringAction, SetActiveAzureResourceByConnectionStringActionParameters , setActiveAzureResourceAction } from '../actions';
import { AccessVerificationState } from '../models/accessVerificationState';
import { setConnectionStringAction } from '../../login/actions';
import { addConnectionStringAction } from '../../connectionStrings/actions';

describe('setActiveAzureResourceByConnectionStringSaga (persist string)', () => {
    const parameters: SetActiveAzureResourceByConnectionStringActionParameters = {
        connectionString: 'connectionString',
        hostName: 'hostname',
        persistConnectionString: true
    };
    const setActiveAzureResourceByConnectionStringSagaGenerator = cloneableGenerator(setActiveAzureResourceByConnectionStringSaga)(setActiveAzureResourceByConnectionStringAction(parameters));

    it('yields put effect to addConnectionStringAction', () => {
        expect(setActiveAzureResourceByConnectionStringSagaGenerator.next()).toEqual({
            done: false,
            value: put(addConnectionStringAction('connectionString'))
        });
    });

    it('yields put effect to setConnectionStringAction', () => {
        expect(setActiveAzureResourceByConnectionStringSagaGenerator.next()).toEqual({
            done: false,
            value: put(setConnectionStringAction({
                connectionString: 'connectionString',
                rememberConnectionString: true
            }))
        });
    });

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

describe('setActiveAzureResourceByConnectionStringSaga (do not persist string)', () => {
    const parameters: SetActiveAzureResourceByConnectionStringActionParameters = {
        connectionString: 'connectionString',
        hostName: 'hostname',
        persistConnectionString: false
    };
    const setActiveAzureResourceByConnectionStringSagaGenerator = cloneableGenerator(setActiveAzureResourceByConnectionStringSaga)(setActiveAzureResourceByConnectionStringAction(parameters));

    it('yields put effect to setConnectionStringAction', () => {
        expect(setActiveAzureResourceByConnectionStringSagaGenerator.next()).toEqual({
            done: false,
            value: put(setConnectionStringAction({
                connectionString: 'connectionString',
                rememberConnectionString: false
            }))
        });
    });

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
