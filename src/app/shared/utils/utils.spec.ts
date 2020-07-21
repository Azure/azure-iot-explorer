/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import 'jest';
import { generateKey, validateKey, validateThumbprint, validateDeviceId, getRootFolder, getParentFolder } from './utils';

describe('utils', () => {
    // tslint:disable-next-line:no-any
    const localWindow = window as any;
    localWindow.crypto = {
      getRandomValues: jest.fn()
    };

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
            expect(validateThumbprint('ca92f024e1acab505b138ebfe1425efa91e3ed78')).toBeTruthy();
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
