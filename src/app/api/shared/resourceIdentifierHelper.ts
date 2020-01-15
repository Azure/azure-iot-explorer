/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { AzureResourceIdentifier } from '../../azureResourceIdentifier/models/azureResourceIdentifier';

export const generateResourceIdentifierUrlPath = (azureResourceIdentifier: AzureResourceIdentifier): string => {
    const { subscriptionId, resourceGroup, type, id } = azureResourceIdentifier;

    return `subscriptions/${subscriptionId}/resourceGroups/${resourceGroup}/${type}/${id}`;
};
