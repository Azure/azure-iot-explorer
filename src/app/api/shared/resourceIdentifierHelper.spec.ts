/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { generateResourceIdentifierUrlPath } from './resourceIdentifierHelper';
import { AzureResourceIdentifier } from '../../azureResourceIdentifier/models/azureResourceIdentifier';
import { AzureResourceIdentifierType } from '../../azureResourceIdentifier/models/azureResourceIdentifierType';

describe('generateResourceIdentifierUriPath', () => {
    it('generates expected value', () => {
        const azureResourceIdentifier: AzureResourceIdentifier = {
            id: 'id1',
            location: 'location1',
            name: 'name1',
            resourceGroup: 'resourceGroup1',
            subscriptionId: 'sub1',
            type: AzureResourceIdentifierType.IotHub
        };

        expect(generateResourceIdentifierUrlPath(azureResourceIdentifier)).toEqual(`subscriptions/sub1/resourceGroups/resourceGroup1/${AzureResourceIdentifierType.IotHub}/id1`);
    });
});
