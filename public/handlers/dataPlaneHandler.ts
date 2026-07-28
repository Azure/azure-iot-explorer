/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
// @ts-ignore no type declarations available
import ssrfFilter from 'ssrf-req-filter';
import {
    validateAzureIoTHostname,
    sanitizeHeaders,
    validatePath,
    validateQueryString
} from './urlValidator';
import { DataPlaneRequest, DataPlaneResponse } from '../interfaces/deviceInterface';

const DEVICE_STATUS_HEADER = 'x-ms-command-statuscode';
const REQUEST_TIMEOUT_MS = 30_000;
const SERVER_ERROR = 500;

interface DataPlaneFetchResponse {
    headers: {
        entries(): IterableIterator<[string, string]>;
        get(name: string): string | null;
    };
    json(): Promise<unknown>;
    status: number;
    statusText: string;
}

const loadFetch = async () => (await import('node-fetch')).default;

const serializeHeaders = (headers: DataPlaneFetchResponse['headers']): Record<string, string> =>
    Object.fromEntries(headers.entries());

/**
 * Handle data plane request via IPC
 * This replaces the Express route handler
 */
export const handleDataPlaneRequest = async (
    _event: Electron.IpcMainInvokeEvent,
    request: DataPlaneRequest
): Promise<DataPlaneResponse> => {
    try {
        if (!request || Object.keys(request).length === 0) {
            return {
                body: { body: { Message: 'Request body is empty' } },
                statusCode: 400,
                statusText: 'Bad Request'
            };
        }

        const dataPlaneRequest = await generateDataPlaneRequestBody(request);
        const fetch = await loadFetch();
        const response = await fetch(dataPlaneRequest.url, dataPlaneRequest.request);
        return await processDataPlaneResponse(response);
    } catch (error) {
        return {
            body: { body: { Message: error?.message || 'Unknown error' } },
            statusCode: SERVER_ERROR,
            statusText: 'Internal Server Error'
        };
    }
};

/**
 * Generate the fetch request configuration for Azure IoT Hub
 */
export const generateDataPlaneRequestBody = async (request: DataPlaneRequest) => {
    const hostname = request.hostName;

    // Strict hostname validation - must be a valid Azure IoT Hub endpoint
    if (!validateAzureIoTHostname(hostname)) {
        throw new Error('Invalid hostname: must be a valid Azure IoT Hub endpoint (e.g., *.azure-devices.net, *.azure-devices.cn, *.azure-devices.us)');
    }

    // Validate path
    const path = request.path;
    if (!validatePath(path)) {
        throw new Error('Invalid path: contains disallowed characters');
    }

    // Build and validate query string
    const apiVersion = request.apiVersion;
    const queryString = request.queryString
        ? `?${request.queryString}&api-version=${apiVersion}`
        : `?api-version=${apiVersion}`;

    if (!validateQueryString(queryString)) {
        throw new Error('Invalid query string: contains disallowed characters');
    }

    // Sanitize headers - only allow safe headers through
    const sanitizedClientHeaders = sanitizeHeaders(request.headers);

    const headers = {
        'Accept': 'application/json',
        'Authorization': request.sharedAccessSignature,
        'Content-Type': 'application/json',
        ...sanitizedClientHeaders
    };

    const url = `https://${hostname}/${encodeURIComponent(path)}${queryString}`;

    return {
        url,
        request: {
            body: request.body,
            headers,
            method: request.httpMethod.toUpperCase(),
            redirect: 'error' as const,  // Block all HTTP redirects (SSRF protection)
            signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
            // Use ssrf-req-filter for SSRF protection
            // Blocks requests to private IPs, loopback, link-local, etc.
            agent: ssrfFilter(url),
        }
    };
};

/**
 * Process the response from Azure IoT Hub
 */
// tslint:disable-next-line:cyclomatic-complexity
export const processDataPlaneResponse = async (dataPlaneResponse: DataPlaneFetchResponse): Promise<DataPlaneResponse> => {
    try {
        if (!dataPlaneResponse) {
            throw new Error('Failed to get any response from iot hub service.');
        }
        if (dataPlaneResponse.headers && dataPlaneResponse.headers.get(DEVICE_STATUS_HEADER)) {
            // handles happy failure cases when error code is returned as a header
            let deviceResponseBody;
            try {
                deviceResponseBody = await dataPlaneResponse.json();
            } catch {
                throw new Error('Failed to parse response from device. The response is expected to be a JSON document up to 128 KB. Learn more: https://docs.microsoft.com/en-us/azure/iot-hub/iot-hub-devguide-direct-methods#method-lifecycle.');
            }
            return {
                body: { body: deviceResponseBody },
                statusCode: parseInt(dataPlaneResponse.headers.get(DEVICE_STATUS_HEADER) as string, 10),
                statusText: dataPlaneResponse.statusText
            };
        } else if (dataPlaneResponse.status === 204) {
            return {
                body: { body: null, headers: serializeHeaders(dataPlaneResponse.headers) },
                statusCode: dataPlaneResponse.status,
                statusText: dataPlaneResponse.statusText
            };
        } else {
            return {
                body: { body: await dataPlaneResponse.json(), headers: serializeHeaders(dataPlaneResponse.headers) },
                statusCode: dataPlaneResponse.status,
                statusText: dataPlaneResponse.statusText
            };
        }
    } catch (error) {
        return {
            body: { body: { Message: error.message } },
            statusCode: SERVER_ERROR,
            statusText: 'Internal Server Error'
        };
    }
};
