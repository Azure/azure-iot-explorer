/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { mapPropertyArrayToObject } from './mapUtils';

describe('mapPropertyArrayToObject', () => {
    it('returns expected data structure', () => {
        const fieldNames = [
            'name',
            'id',
            'account'
        ];

        const fieldValues = [
            'myName',
            'myId',
            'myAccount'
        ];

        expect(mapPropertyArrayToObject(fieldNames, fieldValues)).toEqual({
            account: 'myAccount',
            id: 'myId',
            name: 'myName'
        });
    });

    it('maps a value to undefined if fieldName possesses no associated fieldValue', () => {
        const fieldNames = [
            'name',
            'id',
            'account'
        ];

        const fieldValues = [
            'myName',
            'myId'
        ];

        expect(mapPropertyArrayToObject(fieldNames, fieldValues)).toEqual({
            account: undefined,
            id: 'myId',
            name: 'myName'
        });
    });
});
