/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import  * as express from 'express';
import { generateDataPlaneRequestBody, processDataPlaneResponse } from './dataPlaneHelper';

describe('server', () => {
    const hostName = 'testHub.private.azure-devices.net';
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
                url: `https://${hostName}/%2FdigitalTwins%2FtestDevice%2Finterfaces%2Fsensor%2Fcommands%2Fturnon?${queryString}&api-version=2019-07-01-preview`,
                request: {
                    body: undefined,
                    headers: {
                        'Accept': 'application/json',
                        'Authorization': req.body.sharedAccessSignature,
                        'Content-Type': 'application/json'
                    },
                    method: 'POST',
                }
            }
        );
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
