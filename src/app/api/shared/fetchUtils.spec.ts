/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { getHeaderValue } from './fetchUtils';

const headers = {
    has: (name: string) => false,
};

describe('getHeaderValue', () => {
    it('returns undefinedValue when response is falsy', () => {
        expect(getHeaderValue(undefined, 'HEADER_NAME', 'undefinedValue')).toEqual('undefinedValue');
    });

    it('returns undefinedValue when response.Headers is falsy', () => {
        expect(getHeaderValue({headers: undefined}, 'HEADER_NAME', 'undefinedValue')).toEqual('undefinedValue');
    });

    it ('returns undefinedValue when header name is falsy', () => {
        const response = {
            headers: {
                has: (name: string) => false
            }
        };
        // tslint:disable-next-line: no-any
        expect(getHeaderValue(response as any, undefined, 'undefinedValue')).toEqual('undefinedValue');
    });

    it('returns undefined value when header not present', () => {
        const response = {
            headers: {
                has: (name: string) => false
            }
        };
        // tslint:disable-next-line: no-any
        expect(getHeaderValue(response as any, 'HEADER_NAME', 'undefinedValue')).toEqual('undefinedValue');
    });

    it('returns header', () => {
        const response = {
            headers: {
                get: (name: string) => 'value',
                has: (name: string) => true
            }
        };
        // tslint:disable-next-line: no-any
        expect(getHeaderValue(response as any, 'HEADER_NAME')).toEqual('value');
    });
});
