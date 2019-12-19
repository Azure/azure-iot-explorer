/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/

export interface AzureResourceIdentifier {
    resourceName: string;
    resouceGroupName: string;
    subscriptionId: string;
    location: string;
}
