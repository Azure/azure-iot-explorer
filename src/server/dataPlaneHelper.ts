/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as express from 'express';
import { Response } from 'node-fetch';
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
        url: `https://${req.body.hostName}/${encodeURIComponent(req.body.path)}${queryString}`,
        request: {
            body: req.body.body,
            headers,
            method: req.body.httpMethod.toUpperCase(),
        }
    };
};

export const generateDataPlaneResponse = async (dataPlaneResponse: Response, res: express.Response) => {
    const response = await processDataPlaneResponse(dataPlaneResponse);
    res.status(response.statusCode).send(response.body);
};

// tslint:disable-next-line:cyclomatic-complexity
export const processDataPlaneResponse = async (dataPlaneResponse: Response) => {
    try {
        if(!dataPlaneResponse) {
            throw new Error('Failed to get any response from iot hub service.');
        }
        if (dataPlaneResponse.headers && dataPlaneResponse.headers.get(DEVICE_STATUS_HEADER)) { // handles happy failure cases when error code is returned as a header
            let deviceResponseBody;
            try {
                deviceResponseBody = await dataPlaneResponse.json();
            }
            catch {
                throw new Error('Failed to parse response from device. The response is expected to be a JSON document up to 128 KB. Learn more: https://docs.microsoft.com/en-us/azure/iot-hub/iot-hub-devguide-direct-methods#method-lifecycle.');
            }
            return {
                body: {body: deviceResponseBody},
                statusCode: parseInt(dataPlaneResponse.headers.get(DEVICE_STATUS_HEADER) as string)
            };
        }
        else {
            return {
                body: {body: await dataPlaneResponse.json(), headers: dataPlaneResponse.headers},
                statusCode: dataPlaneResponse.status
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
