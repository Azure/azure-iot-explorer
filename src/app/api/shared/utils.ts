/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { createHmac } from 'crypto';
import { IoTHubConnectionSettings } from '../services/devicesService';
import { LIST_PLUG_AND_PLAY_DEVICES, SAS_EXPIRES_MINUTES } from '../../constants/devices';
import DeviceQuery, { QueryClause, ParameterType, OperationType } from '../models/deviceQuery';
import { RepoConnectionSettings } from '../services/digitalTwinsModelService';

const MILLISECONDS_PER_SECOND = 1000;
const SECONDS_PER_MINUTE = 60;

export const enum PnPQueryPrefix {
    HAS_CAPABILITY_MODEL = 'HAS_CAPABILITYMODEL',
    HAS_INTERFACE = 'HAS_INTERFACE'
}

export const generateSasToken = (resourceUri: string, sharedAccessKeyName: string, sharedAccessKey: string) => {
    const encodedUri = encodeURIComponent(resourceUri);

    const expires = Math.ceil((Date.now() / MILLISECONDS_PER_SECOND) + SAS_EXPIRES_MINUTES * SECONDS_PER_MINUTE);
    const toSign = encodedUri + '\n' + expires;

    const hmac = createHmac('sha256', new Buffer(sharedAccessKey, 'base64'));
    hmac.update(toSign);
    const base64UriEncoded = encodeURIComponent(hmac.digest('base64'));

    const token = `SharedAccessSignature sr=${encodedUri}&sig=${base64UriEncoded}&se=${expires}&skn=${sharedAccessKeyName}`;

    return token;
};

export const generatePnpSasToken = (repositoryId: string, audience: string, secret: string, keyName: string) => {
    const now = new Date();
    const ms = 1000;
    const expiry = (now.setDate(now.getDate() + 1) / ms).toFixed(0);
    const encodedServiceEndpoint = encodeURIComponent(audience);
    const encodedRepoId = encodeURIComponent(repositoryId);
    const signature = [encodedRepoId, encodedServiceEndpoint, expiry].join('\n').toLowerCase();
    const sigUTF8 = new Buffer(signature, 'utf8');
    const secret64bit = new Buffer(secret, 'base64');
    const hmac = createHmac('sha256', secret64bit);
    hmac.update(sigUTF8);
    const hash = encodeURIComponent(hmac.digest('base64'));
    return `SharedAccessSignature sr=${encodedServiceEndpoint}&sig=${hash}&se=${expiry}&skn=${keyName}&rid=${repositoryId}`;
};

export const getRepoConnectionInfoFromConnectionString = (connectionString: string): RepoConnectionSettings => {
    const connectionObject: RepoConnectionSettings = {};
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
            case 'RepositoryId':
            connectionObject.repositoryId = keyValue[1];
            break;
            default:
            // we don't use other parts of connection string
            break;
        }
    });

    return connectionObject;
};

export const getConnectionInfoFromConnectionString = (connectionString: string): IoTHubConnectionSettings => {
    const connectionObject: IoTHubConnectionSettings = {};
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
        case ParameterType.capabilityModelId:
            return toPnPClause(PnPQueryPrefix.HAS_CAPABILITY_MODEL, clause.value);
        case ParameterType.interfaceId:
            return toPnPClause(PnPQueryPrefix.HAS_INTERFACE, clause.value);
        default:
            return clauseItemToString(clause.parameterType, clause.operation, clause.value);
    }
};

export const clauseItemToString = (fieldName: string, operation: OperationType, value: unknown) => {
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
    return `${pnpFunctionName}(${escapeValue(value)})`;
};
