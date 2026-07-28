/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import 'jest';
import {
    generateDataPlaneRequestBody,
    processDataPlaneResponse,
} from './dataPlaneHandler';

const mockAgent = {};
jest.mock('ssrf-req-filter', () => jest.fn(() => mockAgent));

describe('dataPlaneHandler', () => {
    describe('generateDataPlaneRequestBody', () => {
        it('preserves redirect and SSRF protections with an abort timeout', async () => {
            const timeoutSignal = new AbortController().signal;
            const timeoutSpy = jest.spyOn(AbortSignal, 'timeout').mockReturnValue(timeoutSignal);

            const result = await generateDataPlaneRequestBody({
                apiVersion: '2021-04-12',
                body: '{"value":1}',
                headers: { 'x-ms-client-request-id': 'request-id' },
                hostName: 'test-hub.azure-devices.net',
                httpMethod: 'post',
                path: 'devices/test-device/methods',
                sharedAccessSignature: 'SharedAccessSignature redacted',
            });

            expect(timeoutSpy).toHaveBeenCalledWith(30_000);
            expect(result.request).toEqual(expect.objectContaining({
                agent: mockAgent,
                method: 'POST',
                redirect: 'error',
                signal: timeoutSignal,
            }));
            expect(result.url).toBe('https://test-hub.azure-devices.net/devices%2Ftest-device%2Fmethods?api-version=2021-04-12');
        });
    });

    describe('processDataPlaneResponse', () => {
        it('uses the device status header and parsed response body', async () => {
            const response = {
                headers: {
                    entries: jest.fn(),
                    get: jest.fn().mockReturnValue('207'),
                },
                json: jest.fn().mockResolvedValue({ result: 'partial' }),
                status: 200,
                statusText: 'OK',
            };

            await expect(processDataPlaneResponse(response)).resolves.toEqual({
                body: { body: { result: 'partial' } },
                statusCode: 207,
                statusText: 'OK',
            });
        });

        it('serializes response headers for Electron IPC', async () => {
            const response = {
                headers: {
                    entries: jest.fn().mockReturnValue(new Map([
                        ['content-type', 'application/json'],
                        ['x-ms-continuation', 'next-page'],
                    ]).entries()),
                    get: jest.fn().mockReturnValue(null),
                },
                json: jest.fn().mockResolvedValue([{ deviceId: 'device-1' }]),
                status: 200,
                statusText: 'OK',
            };

            await expect(processDataPlaneResponse(response)).resolves.toEqual({
                body: {
                    body: [{ deviceId: 'device-1' }],
                    headers: {
                        'content-type': 'application/json',
                        'x-ms-continuation': 'next-page',
                    },
                },
                statusCode: 200,
                statusText: 'OK',
            });
        });

        it('returns an internal error when JSON parsing fails', async () => {
            const response = {
                headers: {
                    entries: jest.fn(),
                    get: jest.fn().mockReturnValue(null),
                },
                json: jest.fn().mockRejectedValue(new Error('invalid JSON')),
                status: 200,
                statusText: 'OK',
            };

            await expect(processDataPlaneResponse(response)).resolves.toEqual({
                body: { body: { Message: 'invalid JSON' } },
                statusCode: 500,
                statusText: 'Internal Server Error',
            });
        });
    });
});
