/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as express from 'express';
import { Response } from 'node-fetch';
import {
    validateAzureIoTHostname,
    sanitizeHeaders,
    validatePath,
    validateQueryString
} from './urlValidator';

const DEVICE_STATUS_HEADER = 'x-ms-command-statuscode';
const SERVER_ERROR = 500;

// Cache the dynamically imported module
let requestFilteringAgent: any = null;

/**
 * Dynamically import request-filtering-agent (ESM module)
 * Uses Function constructor to prevent TypeScript from converting to require()
 */
const getRequestFilteringAgent = async () => {
    if (!requestFilteringAgent) {
        // Use Function constructor to create a true dynamic import that won't be transformed by TypeScript
        const dynamicImport = new Function('specifier', 'return import(specifier)');
        requestFilteringAgent = await dynamicImport('request-filtering-agent');
    }
    return requestFilteringAgent;
};

export const generateDataPlaneRequestBody = async (req: express.Request) => {
    const hostname = req.body.hostName;

    // Strict hostname validation - must be exactly *.azure-devices.net
    if (!validateAzureIoTHostname(hostname)) {
        throw new Error('Invalid hostname: must be a valid Azure IoT Hub endpoint (*.azure-devices.net)');
    }

    // Validate path
    const path = req.body.path;
    if (!validatePath(path)) {
        throw new Error('Invalid path: contains disallowed characters');
    }

    // Build and validate query string
    const apiVersion = req.body.apiVersion;
    const queryString = req.body.queryString
        ? `?${req.body.queryString}&api-version=${apiVersion}`
        : `?api-version=${apiVersion}`;

    if (!validateQueryString(queryString)) {
        throw new Error('Invalid query string: contains disallowed characters');
    }

    // Sanitize headers - only allow safe headers through
    const sanitizedClientHeaders = sanitizeHeaders(req.body.headers);

    const headers = {
        'Accept': 'application/json',
        'Authorization': req.body.sharedAccessSignature,
        'Content-Type': 'application/json',
        ...sanitizedClientHeaders
    };

    const url = `https://${hostname}/${encodeURIComponent(path)}${queryString}`;

    // Dynamically import ESM module for SSRF protection
    const { useAgent } = await getRequestFilteringAgent();

    return {
        url,
        request: {
            body: req.body.body,
            headers,
            method: req.body.httpMethod.toUpperCase(),
            redirect: 'error' as const,  // Block all HTTP redirects (SSRF protection)
            timeout: 30000,  // 30 second timeout
            // Use request-filtering-agent for SSRF protection
            // Blocks requests to private IPs, loopback, link-local, IMDS, etc.
            agent: useAgent(url),
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
        else if (dataPlaneResponse.status === 204) {
            return {
                body: {body: null, headers: dataPlaneResponse.headers},
                statusCode: dataPlaneResponse.status
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
