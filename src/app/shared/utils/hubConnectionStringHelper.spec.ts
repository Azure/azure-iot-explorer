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
        expect(isValidEventHubConnectionString('Endpoint=sb://123/;SharedAccessKeyName=456;SharedAccessKey=789')).toEqual(true);
        expect(isValidEventHubConnectionString('Endpoint=sb://123/;SharedAccessKeyName=456;SharedAccess=789')).toEqual(false);
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
