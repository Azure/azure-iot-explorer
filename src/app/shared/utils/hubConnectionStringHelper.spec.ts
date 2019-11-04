/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import 'jest';
import { generateConnectionStringValidationError } from './hubConnectionStringHelper';
import { ResourceKeys } from '../../../localization/resourceKeys';

describe('hubConnectionStringHelper', () => {

    it('generates error when value is not provided', () => {
        expect(generateConnectionStringValidationError('')).toEqual(ResourceKeys.connectivityPane.connectionStringTextBox.errorMessages.required);
    });

    it('generates error when value is repo connection string', () => {
        expect(
            generateConnectionStringValidationError('HostName=repo.azureiotrepository.com;RepositoryId=123;SharedAccessKeyName=456;SharedAccessKey=789'))
            .toEqual(ResourceKeys.connectivityPane.connectionStringTextBox.errorMessages.invalid);
    });

    it('generates error when value does not contain expected property', () => {
        expect(
            generateConnectionStringValidationError('HostName=testhub.azure-devices.net;SharedAccessKey=123'))
            .toEqual(ResourceKeys.connectivityPane.connectionStringTextBox.errorMessages.invalid);
    });

    it('does not generate error when value is in right format', () => {
        expect(generateConnectionStringValidationError('HostName=testhub.azure-devices.net;SharedAccessKeyName=123;SharedAccessKey=456')).toEqual(null);
    });
});
