/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import express = require('express');
import { generateDataPlaneRequestBody, API_VERSION, processDataPlaneResponse } from './dataPlaneHelper'; // note: remove auto-generated dataPlaneHelper.js in order to run this test

describe('server', () => {
    const hostName = 'testHub.private.azure-devices-int.net';
    it('generates data plane request with API version and query string specified in body', () => {
        const queryString = 'connectTimeoutInSeconds=20&responseTimeoutInSeconds=20';
        const req = {
            body: {
                apiVersion: '2019-07-01-preview',
                hostName,
                httpMethod: 'POST',
                path: '/digitalTwins/testDevice/interfaces/sensor/commands/turnon',
                queryString,
                sharedAccessSignature: `SharedAccessSignature sr=${hostName}%2Fdevices%2Fquery&sig=123&se=456&skn=iothubowner`
            }
        };
        const requestBody = generateDataPlaneRequestBody(req as express.Request);
        expect(requestBody).toEqual(
            {
                body: undefined,
                headers: {
                    'Accept': 'application/json',
                    'Authorization': req.body.sharedAccessSignature,
                    'Content-Type': 'application/json'
                },
                method: 'POST',
                uri: `https://${hostName}/%2FdigitalTwins%2FtestDevice%2Finterfaces%2Fsensor%2Fcommands%2Fturnon?${queryString}&api-version=2019-07-01-preview`,
            }
        );
    });

    it('generates data plane request without API version or query string specified in body', () => {
        const req =  {
            body: {
                body: '{"query":"\\n    SELECT deviceId as DeviceId,\\n    status as Status,\\n    FROM devices WHERE STARTSWITH(devices.deviceId, \'test\')"}',
                headers: { 'x-ms-max-item-count': 20 },
                hostName,
                httpMethod: 'POST',
                path: 'devices/query',
                sharedAccessSignature: `SharedAccessSignature sr=${hostName}%2Fdevices%2Fquery&sig=123&se=456&skn=iothubowner`
            }
        };
        const requestBody = generateDataPlaneRequestBody(req as express.Request);
        expect(requestBody).toEqual(
            {
                body: '{"query":"\\n    SELECT deviceId as DeviceId,\\n    status as Status,\\n    FROM devices WHERE STARTSWITH(devices.deviceId, \'test\')"}',
                headers: {
                    'Accept': 'application/json',
                    'Authorization': req.body.sharedAccessSignature,
                    'Content-Type': 'application/json',
                    'x-ms-max-item-count': 20
                },
                method: 'POST',
                uri: `https://${hostName}/devices%2Fquery?api-version=${API_VERSION}`,
            }
        );
    });

    it('generates data plane response with success', () => {
        // tslint:disable
        const res: any =  {
            headers: {
                'content-length': '10319',
                'content-type': 'application/json; charset=utf-8',
                vary: 'Origin',
                server: 'Microsoft-HTTPAPI/2.0',
                'iothub-errorcode': 'ServerError',
                date: 'Thu, 29 Aug 2019 00:49:10 GMT',
                connection: 'close'
            },
            statusCode: 200
        };
        // tslint:enable
        const response = processDataPlaneResponse(res, null);
        // tslint:disable-next-line:no-magic-numbers
        expect(response.statusCode).toEqual(200);
        expect(response.body).toEqual({body: null, headers: res.headers});
    });

    it('generates data plane response with error', () => {
        // tslint:disable
        const res: any =  {
            headers: {
                'content-length': '10319',
                'content-type': 'application/json; charset=utf-8',
                vary: 'Origin',
                server: 'Microsoft-HTTPAPI/2.0',
                'iothub-errorcode': 'ServerError',
                date: 'Thu, 29 Aug 2019 00:49:10 GMT',
                connection: 'close'
            },
            statusCode: 500
        };
        // tslint:enable
        const response = processDataPlaneResponse(res, null);
        // tslint:disable-next-line:no-magic-numbers
        expect(response.statusCode).toEqual(500);
        expect(response.body).toEqual({body: null, headers: res.headers});
    });

    it('generates data plane response with no httpResponse', () => {
        const response = processDataPlaneResponse(null, null);
        expect(response.body).toEqual(`Cannot read property 'headers' of null`);
    });

    it('generates data plane response using device status code', () => {
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
                'x-ms-command-statuscode': '404'
            },
            statusCode: 200
        };
        // tslint:enable
        const response = processDataPlaneResponse(res, null);
        // tslint:disable-next-line:no-magic-numbers
        expect(response.statusCode).toEqual(404);
        expect(response.body).toEqual({body: null});
    });
});
