/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import 'jest';
import { formatConnectionStrings, generateConnectionStringValidationError, getActiveConnectionString, isValidEventHubConnectionString } from './hubConnectionStringHelper';
import { ResourceKeys } from '../../../localization/resourceKeys';
import { CONNECTION_STRING_LIST_MAX_LENGTH } from '../../constants/browserStorage';

describe('hubConnectionStringHelper', () => {

    it('generates error when value is not provided', () => {
        expect(generateConnectionStringValidationError('')).toEqual(ResourceKeys.connectivityPane.connectionStringComboBox.errorMessages.required);
    });

    it('generates error when value does not contain expected property', () => {
        expect(
            generateConnectionStringValidationError('HostName=testhub.azure-devices.net;SharedAccessKey=123'))
            .toEqual(ResourceKeys.connectivityPane.connectionStringComboBox.errorMessages.invalid);
    });

    it('does not generate error when value is in right format', () => {
        expect(generateConnectionStringValidationError('HostName=testhub.azure-devices.net;SharedAccessKeyName=123;SharedAccessKey=456')).toEqual(null);
    });

    it('validates event hub connection string', () => {
        expect(isValidEventHubConnectionString(null)).toEqual(true);
        expect(isValidEventHubConnectionString('Endpoint=sb://mynamespace.servicebus.windows.net/;SharedAccessKeyName=456;SharedAccessKey=789')).toEqual(true);
        expect(isValidEventHubConnectionString('Endpoint=sb://my-ns.privatelink.servicebus.windows.net/;SharedAccessKeyName=456;SharedAccessKey=789')).toEqual(true);
        expect(isValidEventHubConnectionString('Endpoint=sb://123/;SharedAccessKeyName=456;SharedAccess=789')).toEqual(false);
    });

    it('validates Azure China event hub connection string', () => {
        expect(isValidEventHubConnectionString('Endpoint=sb://mynamespace.servicebus.chinacloudapi.cn/;SharedAccessKeyName=456;SharedAccessKey=789')).toEqual(true);
        expect(isValidEventHubConnectionString('Endpoint=sb://my-ns.privatelink.servicebus.chinacloudapi.cn/;SharedAccessKeyName=456;SharedAccessKey=789')).toEqual(true);
    });

    it('validates Azure US Gov event hub connection string', () => {
        expect(isValidEventHubConnectionString('Endpoint=sb://mynamespace.servicebus.usgovcloudapi.net/;SharedAccessKeyName=456;SharedAccessKey=789')).toEqual(true);
        expect(isValidEventHubConnectionString('Endpoint=sb://my-ns.privatelink.servicebus.usgovcloudapi.net/;SharedAccessKeyName=456;SharedAccessKey=789')).toEqual(true);
    });

    it('rejects event hub connection string with attacker hostname', () => {
        expect(isValidEventHubConnectionString('Endpoint=sb://evil.com/;SharedAccessKeyName=456;SharedAccessKey=789')).toEqual(false);
        expect(isValidEventHubConnectionString('Endpoint=sb://attacker-controlled-host.com;SharedAccessKeyName=test;SharedAccessKey=dGVzdA==')).toEqual(false);
    });

    it('rejects event hub connection string with spoofed hostname suffix', () => {
        expect(isValidEventHubConnectionString('Endpoint=sb://ns.servicebus.windows.net.evil.com/;SharedAccessKeyName=x;SharedAccessKey=y')).toEqual(false);
        expect(isValidEventHubConnectionString('Endpoint=sb://ns.servicebus.windows.netEVIL/;SharedAccessKeyName=x;SharedAccessKey=y')).toEqual(false);
        expect(isValidEventHubConnectionString('Endpoint=sb://ns.servicebus.windows.net/evil.com;SharedAccessKeyName=x;SharedAccessKey=y')).toEqual(false);
    });

    it('formats connection strings', () => {
        const connectionStrings = [];
        for (let i = CONNECTION_STRING_LIST_MAX_LENGTH; i > 0; i--) {
            connectionStrings.push({
                connectionString: `connectionString${i}`,
                expiration: (new Date(0)).toUTCString()
            });
        }
        expect(formatConnectionStrings(connectionStrings, 'connectionString1')).toEqual([
            {
                connectionString: 'connectionString1',
                expiration: (new Date(0)).toUTCString()
            },
            ...connectionStrings.slice(0, CONNECTION_STRING_LIST_MAX_LENGTH - 1)
        ]);
    });

    it('gets active connection string', () => {
        const connectionStrings = [];
        for (let i = CONNECTION_STRING_LIST_MAX_LENGTH; i > 0; i--) {
            connectionStrings.push({
                connectionString: `connectionString${i}`,
                expiration: (new Date(0)).toUTCString()
            });
        }
        expect(getActiveConnectionString(JSON.stringify(connectionStrings))).toEqual('connectionString10');
    });
});
