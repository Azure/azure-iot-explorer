/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { createHmac } from 'crypto';
import { IoTHubConnectionSettings } from '../services/devicesService';
import { LIST_PLUG_AND_PLAY_DEVICES, SAS_EXPIRES_MINUTES } from '../../constants/devices';
import { DeviceQuery, QueryClause, ParameterType, OperationType } from '../models/deviceQuery';
import { MILLISECONDS_PER_SECOND, SECONDS_PER_MINUTE } from '../../constants/shared';

export const enum PnPQueryPrefix {
    HAS_CAPABILITY_MODEL = 'HAS_CAPABILITYMODEL',
    HAS_INTERFACE = 'HAS_INTERFACE'
}

export interface GenerateSasTokenParameters {
    /**
     * URI prefix (by segment) of the endpoints that can be accessed with this token, starting with host name of the IoT hub (no protocol). For example, myHub.azure-devices.net/devices/device1
     */
    resourceUri: string;

    /**
     * The key to use for the token.
     */
    key: string;

    /**
     * Expiration time in minutes. Defaults to 5.
     */
    expiration?: number;

    /**
     * The name of the key being used. Omit if the token refers to device-registry credentials.
     */
    keyName?: string;
}

export const generateSasToken = (parameters: GenerateSasTokenParameters) => {
    let token = null;
    if (!!parameters.resourceUri && !!parameters.key) {
        const encodedUri = encodeURIComponent(parameters.resourceUri);

        const expires = Math.ceil((Date.now() / MILLISECONDS_PER_SECOND) + (parameters.expiration || SAS_EXPIRES_MINUTES) * SECONDS_PER_MINUTE);
        const toSign = encodedUri + '\n' + expires;

        const hmac = createHmac('sha256', new Buffer(parameters.key, 'base64'));
        hmac.update(toSign);
        const base64UriEncoded = encodeURIComponent(hmac.digest('base64'));

        token = `SharedAccessSignature sr=${encodedUri}&sig=${base64UriEncoded}&se=${expires}${parameters.keyName ? '&skn=' + parameters.keyName : ''}`;
    }
    return token;
};

export const getConnectionInfoFromConnectionString = (connectionString: string): IoTHubConnectionSettings => {
    const connectionObject: IoTHubConnectionSettings = {};
    if (!connectionString) {
        return connectionObject;
    }
    connectionString.split(';')
    .forEach((segment: string) => {
        const keyValue = segment.split('=');
        switch (keyValue[0]) {
            case 'HostName':
            connectionObject.hostName = keyValue[1];
            break;
            case 'SharedAccessKeyName':
            connectionObject.sharedAccessKeyName = keyValue[1];
            break;
            case 'SharedAccessKey':
            connectionObject.sharedAccessKey = keyValue[1];
            break;
            default:
            // we don't use other parts of connection string
            break;
        }
    });

    return connectionObject;
};

export const buildQueryString = (query: DeviceQuery) => {
    return query ?
        `${LIST_PLUG_AND_PLAY_DEVICES} ${queryToString(query)}` :
        LIST_PLUG_AND_PLAY_DEVICES;
};

export const queryToString = (query: DeviceQuery) => {
    if (query.deviceId) {
        return `WHERE STARTSWITH(devices.deviceId, '${query.deviceId}')`;
    }
    const clauseQuery = clauseListToString(query.clauses && query.clauses.filter(clause => !!clause.parameterType));
    if ('' !== clauseQuery) {
        return `WHERE (${clauseQuery })`;
    }
    return '';
};

export const clauseListToString = (clauses: QueryClause[]) => {
    return clauses && clauses.map(clause => clauseToString(clause)).join(' AND ') || '';
};

export const clauseToString = (clause: QueryClause) => {
    switch (clause.parameterType) {
        case ParameterType.edge:
            return toEdgeClause(clause.parameterType, clause.value);
        case ParameterType.status:
            return toDeviceStatusClause(clause.parameterType, clause.value);
        default:
            return clauseItemToString(clause.parameterType, clause.operation, clause.value);
    }
};

export const clauseItemToString = (fieldName: string, operation: OperationType, value: unknown) => {
    if (!fieldName || !operation || !value) {
        return;
    }
    return `${fieldName} ${operation} ${escapeValue(value as string)}`;
};

export const escapeValue = (value: string) => {
    const isString = new RegExp(/[^0-9.]/);
    const hasQuotes = new RegExp(/^'.*'$/);
    if (value.match(isString) && !value.match(hasQuotes)) {
        return `'${value}'`;
    }
    return value;
};

export const toPnPClause = (pnpFunctionName: string, value: string): string => {
    const urnVersionRegEx = new RegExp(/:[0-9]+$/);
    if (urnVersionRegEx.test(value)) {
        const urnVersion = urnVersionRegEx.exec(value)[0].replace(':', '');
        const urnName = value.replace(urnVersionRegEx, '');

        return `${pnpFunctionName}(${escapeValue(urnName)}, ${urnVersion})`;
    }
    return `${pnpFunctionName}('${value}')`; // when provided value is not urn with version, pass it in as string
};

export const toEdgeClause = (edgeFunctionName: string, value: string): string => {
    return `${edgeFunctionName}=${value === 'true' ? true : false}`;
};

export const toDeviceStatusClause = (edgeFunctionName: string, value: string): string => {
    return `${edgeFunctionName}='${value}'`;
};
