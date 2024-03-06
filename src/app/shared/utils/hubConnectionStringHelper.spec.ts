/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import 'jest';
import { generateConnectionStringValidationError, isValidEventHubConnectionString } from './hubConnectionStringHelper';
import { ResourceKeys } from '../../../localization/resourceKeys';

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
        expect(isValidEventHubConnectionString(null as any)).toEqual(true);
        expect(isValidEventHubConnectionString('Endpoint=sb://123/;SharedAccessKeyName=456;SharedAccessKey=789')).toEqual(true);
        expect(isValidEventHubConnectionString('Endpoint=sb://123/;SharedAccessKeyName=456;SharedAccess=789')).toEqual(false);
    });
});
