/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { AzureResource } from './models/azureResource';

export interface AzureResourceStateInterface {
    activeAzureResource: AzureResource | undefined;
}

export const azureResourceStateInitial = (): AzureResourceStateInterface => {
    return {
        activeAzureResource: undefined
    };
};
