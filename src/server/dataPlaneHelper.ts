/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import express = require('express');
import request = require('request');
export const API_VERSION = '2018-06-30';
const DEVICE_STATUS_HEADER = 'x-ms-command-statuscode';
const MULTIPLE_CHOICES = 300;
const SUCCESS = 200;
const SERVER_ERROR = 500;
const NO_CONTENT_SUCCESS = 204;

export const generateDataPlaneRequestBody = (req: express.Request) => {
    const headers = {
        'Accept': 'application/json',
        'Authorization': req.body.sharedAccessSignature,
        'Content-Type': 'application/json',
        ...req.body.headers
    };

    const apiVersion = req.body.apiVersion || API_VERSION;
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
export const processDataPlaneResponse = (httpRes: request.Response, body: any): {body: {body: any, headers?: any}, statusCode?: number} => { // tslint:disable-line:no-any
    try {
        if (httpRes) {
            if (httpRes.headers && httpRes.headers[DEVICE_STATUS_HEADER]) { // handles happy failure cases when error code is returned as a header
                return {
                    body: {body: JSON.parse(body)},
                    statusCode: parseInt(httpRes.headers[DEVICE_STATUS_HEADER] as string) // tslint:disable-line:radix
                };
            }
            else {
                if (httpRes.statusCode === NO_CONTENT_SUCCESS) {
                    return {
                        body: undefined,
                        statusCode: httpRes.statusCode
                    };
                }
                if (httpRes.statusCode >= SUCCESS && httpRes.statusCode < MULTIPLE_CHOICES) {
                    return {
                        body: {body: JSON.parse(body), headers: httpRes.headers},
                        statusCode: httpRes.statusCode
                    };
                } else {
                    return {
                        body: {body: JSON.parse(body)},
                        statusCode: httpRes.statusCode
                    };
                }
            }
        }
        else {
            return {
                body: {body: JSON.parse(body)}
            };
        }
    }
    catch {
        return {
            body: undefined,
            statusCode: SERVER_ERROR
        };
    }
};
