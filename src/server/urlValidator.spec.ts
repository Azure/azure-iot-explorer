/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import {
    validateAzureIoTHostname,
    sanitizeHeaders,
    validatePath,
    validateQueryString
} from './urlValidator';

describe('urlValidator', () => {
    describe('validateAzureIoTHostname', () => {
        // Valid hostnames
        it('accepts valid Azure IoT Hub hostname', () => {
            expect(validateAzureIoTHostname('myhub.azure-devices.net')).toBe(true);
        });

        it('accepts hub names with hyphens', () => {
            expect(validateAzureIoTHostname('my-iot-hub.azure-devices.net')).toBe(true);
        });

        it('accepts hub names with numbers', () => {
            expect(validateAzureIoTHostname('hub123.azure-devices.net')).toBe(true);
        });

        it('accepts mixed case (normalized)', () => {
            expect(validateAzureIoTHostname('MyHub.Azure-Devices.NET')).toBe(true);
        });

        // Invalid hostnames - SSRF attacks
        it('rejects path injection attack', () => {
            expect(validateAzureIoTHostname('attacker.net/azure-devices.net')).toBe(false);
        });

        it('rejects subdomain spoofing', () => {
            expect(validateAzureIoTHostname('azure-devices.net.attacker.com')).toBe(false);
        });

        it('rejects wrong domain', () => {
            expect(validateAzureIoTHostname('myhub.azure-devices.com')).toBe(false);
        });

        it('rejects extra subdomains', () => {
            expect(validateAzureIoTHostname('sub.myhub.azure-devices.net')).toBe(false);
        });

        it('rejects backslash injection', () => {
            expect(validateAzureIoTHostname('attacker.net\\azure-devices.net')).toBe(false);
        });

        it('rejects URL-encoded characters', () => {
            expect(validateAzureIoTHostname('attacker%2eazure-devices.net')).toBe(false);
        });

        it('rejects port injection', () => {
            expect(validateAzureIoTHostname('myhub.azure-devices.net:8080')).toBe(false);
        });

        it('rejects credential injection', () => {
            expect(validateAzureIoTHostname('user@myhub.azure-devices.net')).toBe(false);
        });

        it('rejects query string injection', () => {
            expect(validateAzureIoTHostname('myhub.azure-devices.net?evil=true')).toBe(false);
        });

        it('rejects fragment injection', () => {
            expect(validateAzureIoTHostname('myhub.azure-devices.net#evil')).toBe(false);
        });

        it('rejects empty string', () => {
            expect(validateAzureIoTHostname('')).toBe(false);
        });

        it('rejects null', () => {
            expect(validateAzureIoTHostname(null as any)).toBe(false);
        });

        it('rejects hub name starting with hyphen', () => {
            expect(validateAzureIoTHostname('-myhub.azure-devices.net')).toBe(false);
        });

        it('rejects hub name ending with hyphen', () => {
            expect(validateAzureIoTHostname('myhub-.azure-devices.net')).toBe(false);
        });
    });

    describe('sanitizeHeaders', () => {
        it('allows safe headers', () => {
            const headers = {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'If-Match': '*'
            };
            const result = sanitizeHeaders(headers);
            expect(result['Content-Type']).toBe('application/json');
            expect(result['Accept']).toBe('application/json');
            expect(result['If-Match']).toBe('*');
        });

        it('blocks Host header', () => {
            const headers = {
                'Host': 'evil.com',
                'Accept': 'application/json'
            };
            const result = sanitizeHeaders(headers);
            expect(result['Host']).toBeUndefined();
            expect(result['Accept']).toBe('application/json');
        });

        it('blocks Authorization header (we set it ourselves)', () => {
            const headers = {
                'Authorization': 'Bearer evil-token'
            };
            const result = sanitizeHeaders(headers);
            expect(result['Authorization']).toBeUndefined();
        });

        it('blocks X-Forwarded-For header', () => {
            const headers = {
                'X-Forwarded-For': '127.0.0.1'
            };
            const result = sanitizeHeaders(headers);
            expect(result['X-Forwarded-For']).toBeUndefined();
        });

        it('blocks CRLF injection in header value', () => {
            const headers = {
                'Accept': 'application/json\r\nX-Injected: evil'
            };
            const result = sanitizeHeaders(headers);
            expect(result['Accept']).toBeUndefined();
        });

        it('blocks null byte injection', () => {
            const headers = {
                'Accept': 'application/json\0evil'
            };
            const result = sanitizeHeaders(headers);
            expect(result['Accept']).toBeUndefined();
        });

        it('handles empty/null headers', () => {
            expect(sanitizeHeaders(undefined)).toEqual({});
            expect(sanitizeHeaders(null as any)).toEqual({});
            expect(sanitizeHeaders({})).toEqual({});
        });

        it('blocks unknown headers', () => {
            const headers = {
                'X-Custom-Header': 'value'
            };
            const result = sanitizeHeaders(headers);
            expect(result['X-Custom-Header']).toBeUndefined();
        });
    });

    describe('validatePath', () => {
        it('allows valid paths', () => {
            expect(validatePath('devices/mydevice')).toBe(true);
            expect(validatePath('twins/mydevice')).toBe(true);
            expect(validatePath('devices/device-1/modules/module-1')).toBe(true);
        });

        it('blocks path traversal', () => {
            expect(validatePath('../etc/passwd')).toBe(false);
            expect(validatePath('devices/../../../etc/passwd')).toBe(false);
        });

        it('blocks double slashes', () => {
            expect(validatePath('devices//mydevice')).toBe(false);
        });

        it('blocks special characters', () => {
            expect(validatePath('devices/<script>')).toBe(false);
            expect(validatePath('devices/my device')).toBe(false);
        });

        it('blocks empty path', () => {
            expect(validatePath('')).toBe(false);
        });
    });

    describe('validateQueryString', () => {
        it('allows valid query strings', () => {
            expect(validateQueryString('?api-version=2020-09-30')).toBe(true);
            expect(validateQueryString('?key=value&other=123')).toBe(true);
        });

        it('allows empty query string', () => {
            expect(validateQueryString('')).toBe(true);
        });

        it('blocks script injection', () => {
            expect(validateQueryString('?<script>alert(1)</script>')).toBe(false);
        });

        it('blocks special characters', () => {
            expect(validateQueryString('?key=value;evil')).toBe(false);
        });
    });
});
