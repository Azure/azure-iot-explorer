/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import  * as express from 'express';
import { processDataPlaneResponse } from './dataPlaneHelper';
import {
    validateAzureIoTHostname,
    sanitizeHeaders,
    validatePath,
    validateQueryString
} from './urlValidator';

describe('server', () => {
    const hostName = 'testhub.azure-devices.net';

    describe('input validation', () => {
        it('validates Azure IoT Hub hostname', () => {
            expect(validateAzureIoTHostname(hostName)).toBe(true);
            expect(validateAzureIoTHostname('attacker.net/azure-devices.net')).toBe(false);
            expect(validateAzureIoTHostname('sub.testhub.azure-devices.net')).toBe(false);
        });

        it('validates path', () => {
            expect(validatePath('digitalTwins/testDevice/interfaces/sensor/commands/turnon')).toBe(true);
            expect(validatePath('../etc/passwd')).toBe(false);
        });

        it('validates query string', () => {
            expect(validateQueryString('?api-version=2020-09-30')).toBe(true);
            expect(validateQueryString('?<script>alert(1)</script>')).toBe(false);
        });

        it('sanitizes headers', () => {
            const result = sanitizeHeaders({
                'Accept': 'application/json',
                'Host': 'evil.com',  // Should be blocked
                'Authorization': 'Bearer token'  // Should be blocked (we set it ourselves)
            });
            expect(result['Accept']).toBe('application/json');
            expect(result['Host']).toBeUndefined();
            expect(result['Authorization']).toBeUndefined();
        });
    });

    it('generates data plane response with success', async () => {
        // tslint:disable
        const res: any =  {
            headers: {
                'content-length': '10319',
                'content-type': 'application/json; charset=utf-8',
                vary: 'Origin',
                server: 'Microsoft-HTTPAPI/2.0',
                'iothub-errorcode': 'ServerError',
                date: 'Thu, 29 Aug 2019 00:49:10 GMT',
                connection: 'close',
                get: () => { return false}
            },
            status: 200,
            json: () => {return new Promise((resolve, reject) => {resolve(null)})}
        };
        // tslint:enable
        const response = await processDataPlaneResponse(res);
        // tslint:disable-next-line:no-magic-numbers
        expect(response.statusCode).toEqual(200);
        expect(response.body).toEqual({body: null, headers: res.headers});
    });

    it('generates data plane response with error', async () => {
        // tslint:disable
        const res: any =  {
            headers: {
                'content-length': '10319',
                'content-type': 'application/json; charset=utf-8',
                vary: 'Origin',
                server: 'Microsoft-HTTPAPI/2.0',
                'iothub-errorcode': 'ServerError',
                date: 'Thu, 29 Aug 2019 00:49:10 GMT',
                connection: 'close',
                get: () => { return false}
            },
            status: 500,
            json: () => {return new Promise((resolve, reject) => {resolve(null)})}
        };
        // tslint:enable
        const response = await processDataPlaneResponse(res);
        // tslint:disable-next-line:no-magic-numbers
        expect(response.statusCode).toEqual(500);
        expect(response.body).toEqual({body: null, headers: res.headers});
    });

    it('generates data plane response with no httpResponse', async () => {
        const response = await processDataPlaneResponse(null as any);
        expect(response.body).toEqual({body: {Message: 'Failed to get any response from iot hub service.'}});
    });

    it('generates data plane response using device status code', async () => {
        // tslint:disable
        const res: any =  {
            headers: {
                'content-length': '10319',
                'content-type': 'application/json; charset=utf-8',
                vary: 'Origin',
                server: 'Microsoft-HTTPAPI/2.0',
                'iothub-errorcode': 'ServerError',
                date: 'Thu, 29 Aug 2019 00:49:10 GMT',
                connection: 'close',
                'x-ms-command-statuscode': '404',
                get: () => { return 404}
            },
            status: 200,
            json: () => (null)
        };
        // tslint:enable
        const response = await processDataPlaneResponse(res);
        // tslint:disable-next-line:no-magic-numbers
        expect(response.statusCode).toEqual(404);
        expect(response.body).toEqual({body: null});
    });
});
