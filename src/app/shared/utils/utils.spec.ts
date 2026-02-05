/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import 'jest';
import { generateKey, validateKey, validateThumbprint, validateDeviceId, getRootFolder, getParentFolder } from './utils';

describe('utils', () => {
    // tslint:disable-next-line:no-any
    const localWindow = window as any;

    const testRandomValueGenerator = (byteArray: Uint8Array) => {
        const defaultValue: number = 1;
        for (let i = 0; i < byteArray.length; i++) {
            byteArray[i] = defaultValue;
        }
    };

    describe('generateKey', () => {
        it('generatesKey with mock value', () => {
            const value = generateKey(testRandomValueGenerator);
            expect(value).toEqual('AQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQE=');
        });

        it('generates a key with mocked crypto function', () => {
            const mockGetRandomValues = jest.fn().mockImplementation((byteArray: Uint8Array) => {
                for (let i = 0; i < byteArray.length; i++) {
                    byteArray[i] = 0;
                }
                return byteArray;
            });
            const mockCrypto = { getRandomValues: mockGetRandomValues };
            
            // Override window.crypto using Object.defineProperty
            Object.defineProperty(window, 'crypto', {
                value: mockCrypto,
                writable: true,
                configurable: true
            });
            
            const value = generateKey();
            expect(value).toEqual('AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=');
        });
    });

    describe('validateKey', () => {
        it('validates device key', () => {
            expect(validateKey('OP/1UijsiKaiH8YOfyk5gg==')).toBeTruthy();
            expect(validateKey('123')).toBeFalsy();
        });
    });

    describe('validateThumbprint', () => {
        it('validates device thumbprint', () => {
            expect(validateThumbprint('A0:F7:88:0B:5C:5A:00:BF:55:71:B8:2F:95:47:7B:AA:94:C1:E5:2B')).toBeTruthy();
            expect(validateThumbprint('123')).toBeFalsy();
        });
    });

    describe('validateDeviceId', () => {
        it('validates device ID', () => {
            expect(validateDeviceId('123')).toBeTruthy();
            expect(validateDeviceId('12 3')).toBeFalsy();
        });
    });

    describe('folder utils', () => {
        let platformGetter;
        beforeEach(() => {
            platformGetter = jest.spyOn(window.navigator, 'platform', 'get');
        });

        it('returns root folder', () => {
            platformGetter.mockReturnValue('Win32');
            expect(getRootFolder()).toEqual(null);

            platformGetter.mockReturnValue('MacIntel');
            expect(getRootFolder()).toEqual('/');
        });

        it('returns parent folder', () => {
            platformGetter.mockReturnValue('Win32');
            expect(getParentFolder('C:/')).toEqual(null);
            expect(getParentFolder('C:/Documents')).toEqual('C:/');
            expect(getParentFolder('C:/Documents/files')).toEqual('C:/Documents');

            platformGetter.mockReturnValue('MacIntel');
            expect(getParentFolder('/Users')).toEqual('/');
            expect(getParentFolder('/Users/User1')).toEqual('/Users');
        });
    });
});
