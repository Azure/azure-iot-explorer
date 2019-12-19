/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/

import { AzureResource } from './models/azureResource';

export interface AzureResourceState {
    activeAzureResource: AzureResource | undefined;
}

export const azureResourceStateInitial = (): AzureResourceState => {
    return {
        activeAzureResource: undefined
    };
};
