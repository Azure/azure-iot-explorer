/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/

// Allowed Azure IoT Hub domain suffixes (global + national clouds)
const ALLOWED_IOT_HUB_SUFFIXES = [
    '.azure-devices.net',  // Global Azure
    '.azure-devices.cn',   // Azure China (21Vianet)
    '.azure-devices.us',   // Azure US Government
];

// Allowed Azure Event Hubs domain suffixes (global + national clouds)
const ALLOWED_EVENTHUB_SUFFIXES = [
    '.servicebus.windows.net',        // Global Azure
    '.servicebus.chinacloudapi.cn',   // Azure China (21Vianet)
    '.servicebus.usgovcloudapi.net',  // Azure US Government
];

// Allowlist of headers that can be passed through from client
const ALLOWED_HEADERS = new Set([
    'content-type',
    'accept',
    'if-match',
    'if-none-match',
    'x-ms-max-item-count',
    'x-ms-continuation'
]);

// Blocked headers that should never be forwarded
const BLOCKED_HEADERS = new Set([
    'host',
    'authorization',  // We set this ourselves
    'cookie',
    'x-forwarded-for',
    'x-forwarded-host',
    'x-real-ip',
    'forwarded'
]);

/**
 * Validates hostname is a valid Azure IoT Hub endpoint.
 * Supports global and national cloud domains:
 * - *.azure-devices.net (Global), *.azure-devices.cn (China), *.azure-devices.us (US Gov)
 * - Also accepts privatelink variants: *.privatelink.azure-devices.{net|cn|us}
 *
 * Security checks:
 * - No path components (no slashes)
 * - No special characters except dots and hyphens in valid positions
 * - Each label follows DNS naming rules
 */
export function validateAzureIoTHostname(hostname: string): boolean {
    if (!hostname || typeof hostname !== 'string') {
        return false;
    }

    const normalizedHost = hostname.toLowerCase().trim();

    // Must end with one of the allowed IoT Hub suffixes
    const matchedSuffix = ALLOWED_IOT_HUB_SUFFIXES.find(suffix => normalizedHost.endsWith(suffix));
    if (!matchedSuffix) {
        return false;
    }

    // Check for path injection - no slashes, backslashes, or encoded variants
    if (/[\/\\%]/.test(normalizedHost)) {
        return false;
    }

    // Check for other dangerous characters (URLs, ports, credentials)
    if (/[@#\?\&\=\:]/.test(normalizedHost)) {
        return false;
    }

    // Extract the prefix before the matched suffix
    // e.g., 'myhub.azure-devices.net' -> prefix = 'myhub'
    // e.g., 'myhub.privatelink.azure-devices.cn' -> prefix = 'myhub.privatelink'
    // e.g., 'myhub.service.azure-devices.net' -> prefix = 'myhub.service'
    // e.g., 'myhub.device.privatelink.azure-devices.net' -> prefix = 'myhub.device.privatelink'
    const prefix = normalizedHost.slice(0, normalizedHost.length - matchedSuffix.length);
    const prefixLabels = prefix.split('.').filter(l => l.length > 0);

    // Allowed prefix patterns:
    //   1 label:  <hub>
    //   2 labels: <hub>.privatelink | <hub>.device | <hub>.service
    //   3 labels: <hub>.device.privatelink | <hub>.service.privatelink
    if (prefixLabels.length < 1 || prefixLabels.length > 3) {
        return false;
    }

    if (prefixLabels.length === 2) {
        const allowedSecondLabels = ['privatelink', 'device', 'service'];
        if (!allowedSecondLabels.includes(prefixLabels[1])) {
            return false;
        }
    }

    if (prefixLabels.length === 3) {
        const allowedEndpointTypes = ['device', 'service'];
        if (!allowedEndpointTypes.includes(prefixLabels[1]) || prefixLabels[2] !== 'privatelink') {
            return false;
        }
    }

    // Validate hub name (first label) follows DNS naming rules
    const hubName = prefixLabels[0];
    const labelRegex = /^[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?$/;

    if (hubName.length === 0 || hubName.length > 63) {
        return false;
    }

    if (!labelRegex.test(hubName)) {
        return false;
    }

    return true;
}

/**
 * Validates hostname is a valid Azure Event Hubs endpoint.
 * Supports global and national cloud domains:
 * - *.servicebus.windows.net (Global)
 * - *.servicebus.chinacloudapi.cn (China)
 * - *.servicebus.usgovcloudapi.net (US Gov)
 * - Also accepts privatelink variants for each
 *
 * Security checks:
 * - No path components (no slashes)
 * - No special characters except dots and hyphens in valid positions
 * - Each label follows DNS naming rules
 */
export function validateEventHubHostname(hostname: string): boolean {
    if (!hostname || typeof hostname !== 'string') {
        return false;
    }

    const normalizedHost = hostname.toLowerCase().trim();

    // Must end with one of the allowed Event Hub suffixes
    const matchedSuffix = ALLOWED_EVENTHUB_SUFFIXES.find(suffix => normalizedHost.endsWith(suffix));
    if (!matchedSuffix) {
        return false;
    }

    // Check for path injection
    if (/[\/\\%]/.test(normalizedHost)) {
        return false;
    }

    // Check for dangerous characters
    if (/[@#\?\&\=\:]/.test(normalizedHost)) {
        return false;
    }

    // Extract the prefix before the matched suffix
    // e.g., 'mynamespace.servicebus.windows.net' -> prefix = 'mynamespace'
    // e.g., 'mynamespace.privatelink.servicebus.chinacloudapi.cn' -> prefix = 'mynamespace.privatelink'
    const prefix = normalizedHost.slice(0, normalizedHost.length - matchedSuffix.length);
    const prefixLabels = prefix.split('.').filter(l => l.length > 0);

    // Must have exactly 1 label (namespace) or 2 labels (namespace.privatelink)
    if (prefixLabels.length !== 1 && prefixLabels.length !== 2) {
        return false;
    }

    if (prefixLabels.length === 2 && prefixLabels[1] !== 'privatelink') {
        return false;
    }

    const namespaceName = prefixLabels[0];
    const labelRegex = /^[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?$/;

    if (namespaceName.length === 0 || namespaceName.length > 63) {
        return false;
    }

    if (!labelRegex.test(namespaceName)) {
        return false;
    }

    return true;
}

/**
 * Extract hostname from an EventHub connection string of the form:
 * Endpoint=sb://<hostname>/;SharedAccessKeyName=...;SharedAccessKey=...
 */
export function extractEventHubHostname(connectionString: string): string {
    if (!connectionString || typeof connectionString !== 'string') {
        throw new Error('Invalid EventHub connection string: missing or empty');
    }
    const match = connectionString.match(/Endpoint=sb:\/\/([^/;\s]+)/i);
    if (!match || !match[1]) {
        throw new Error('Invalid EventHub connection string: unable to extract Endpoint hostname');
    }
    return match[1];
}

/**
 * Sanitize headers from client request
 * Only allows safe headers through, blocks dangerous ones
 */
export function sanitizeHeaders(headers: Record<string, unknown> | undefined): Record<string, string> {
    const sanitized: Record<string, string> = {};

    if (!headers || typeof headers !== 'object') {
        return sanitized;
    }

    for (const [key, value] of Object.entries(headers)) {
        if (typeof key !== 'string' || typeof value !== 'string') {
            continue;
        }

        const lowerKey = key.toLowerCase();

        // Skip blocked headers
        if (BLOCKED_HEADERS.has(lowerKey)) {
            continue;
        }

        // Only allow explicitly allowed headers
        if (!ALLOWED_HEADERS.has(lowerKey)) {
            continue;
        }

        // Check for CRLF injection in header value
        if (/[\r\n\0]/.test(value)) {
            continue;
        }

        // Check for excessively long header values
        if (value.length > 8192) {
            continue;
        }

        sanitized[key] = value;
    }

    return sanitized;
}

/**
 * Validate path contains only safe characters
 */
export function validatePath(path: string): boolean {
    if (!path || typeof path !== 'string') {
        return false;
    }

    // Block path traversal and double slashes
    if (path.includes('..') || path.includes('//')) {
        return false;
    }

    // Allow characters valid in IoT Hub device/module IDs per Azure documentation:
    // alphanumeric plus: - . % _ * ? ! ( ) , : = @ $ '
    // Also allow / for path segments and URL-encoded characters (%XX)
    const pathRegex = /^[a-zA-Z0-9\-._~:@!$&'()*+,;=%/]+$/;

    if (!pathRegex.test(path)) {
        return false;
    }

    return true;
}

/**
 * Validate query string contains only safe characters
 */
export function validateQueryString(queryString: string): boolean {
    if (!queryString || typeof queryString !== 'string') {
        return true; // Empty query string is valid
    }

    // Allow standard query string characters including ? at start, and hyphen in values
    const queryRegex = /^[a-zA-Z0-9=&_%.+?\-]+$/;

    return queryRegex.test(queryString);
}
