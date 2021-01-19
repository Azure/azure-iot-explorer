/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import express = require('express');
import request = require('request');
const DEVICE_STATUS_HEADER = 'x-ms-command-statuscode';
const SERVER_ERROR = 500;

export const generateDataPlaneRequestBody = (req: express.Request) => {
    const headers = {
        'Accept': 'application/json',
        'Authorization': req.body.sharedAccessSignature,
        'Content-Type': 'application/json',
        ...req.body.headers
    };

    const apiVersion = req.body.apiVersion;
    const queryString = req.body.queryString ? `?${req.body.queryString}&api-version=${apiVersion}` : `?api-version=${apiVersion}`;

    return {
        body: req.body.body,
        headers,
        method: req.body.httpMethod.toUpperCase(),
        uri: `https://${req.body.hostName}/${encodeURIComponent(req.body.path)}${queryString}`,
    };
};

export const generateDataPlaneResponse = (httpRes: request.Response, body: any, res: express.Response) => { // tslint:disable-line:no-any
    const response = processDataPlaneResponse(httpRes, body);
    res.status(response.statusCode).send(response.body);
};

// tslint:disable-next-line:cyclomatic-complexity
export const processDataPlaneResponse = (httpRes: request.Response, body: any): {body: {body: any, headers?: any}, statusCode: number} => { // tslint:disable-line:no-any
    try {
        if(!httpRes) {
            throw new Error('Failed to get any response from iot hub service.');
        }
        if (httpRes.headers && httpRes.headers[DEVICE_STATUS_HEADER]) { // handles happy failure cases when error code is returned as a header
            let deviceResponseBody;
            try {
                deviceResponseBody = body && JSON.parse(body);
            }
            catch {
                throw new Error('Failed to parse response from device. The response is expected to be a JSON document up to 128 KB. Learn more: https://docs.microsoft.com/en-us/azure/iot-hub/iot-hub-devguide-direct-methods#method-lifecycle.');
            }
            return {
                body: {body: deviceResponseBody},
                statusCode: parseInt(httpRes.headers[DEVICE_STATUS_HEADER] as string) // tslint:disable-line:radix
            };
        }
        else {
            return {
                body: {body: body && JSON.parse(body), headers: httpRes.headers},
                statusCode: httpRes.statusCode
            };
        }
    }
    catch (error) {
        return {
            body: {body: {Message: error.message}},
            statusCode: SERVER_ERROR
        };
    }
};
