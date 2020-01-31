/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/

export interface AzureResourceIdentifier {
    id: string;
    location: string;
    name: string;
    resourceGroup: string;
    subscriptionId: string;
    type: string;
}
