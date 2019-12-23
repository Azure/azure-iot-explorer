/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { select } from 'redux-saga/effects';
import { cloneableGenerator } from 'redux-saga/utils';
import { getActiveAzureResourceConnectionStringSaga, getActiveAzureResource } from './getActiveAzureResourceConnectionStringSaga';

describe('getActiveAzureResourceConnectionStringSaga', () => {
    const getActiveAzureResourceConnectionStringSagaGenerator = cloneableGenerator(getActiveAzureResourceConnectionStringSaga)();

    it('yields select effect to get active resource', () => {
        expect(getActiveAzureResourceConnectionStringSagaGenerator.next()).toEqual({
            done: false,
            value: select(getActiveAzureResource)
        });
        getActiveAzureResourceConnectionStringSagaGenerator.next();
    });

    describe('azure resource undefined', () => {
        const saga = getActiveAzureResourceConnectionStringSagaGenerator.clone();
        it('finishes with return value of empty string', () => {
            saga.next(); // calls the selector function
            expect(saga.next(undefined)).toEqual({
                done: true,
                value: ''
            });
        });
    });

    describe('azure resource defined', () => {
        const saga = getActiveAzureResourceConnectionStringSagaGenerator.clone();
        it('finishes with return value of connectionString', () => {
            saga.next(); // calls the selector function
            expect(saga.next({
                connectionString: 'connectionString'
            })).toEqual({
                done: true,
                value: 'connectionString'
            });
        });
    });
});

describe('getActiveAzureResource', () => {
    it('returns expected value', () => {
        const state = {
            azureResourceState: {
                activeAzureResource: 'activeAzureResource'
            }
        };

        // tslint:disable-next-line:no-any
        expect(getActiveAzureResource(state as any)).toEqual('activeAzureResource');
    });
});
