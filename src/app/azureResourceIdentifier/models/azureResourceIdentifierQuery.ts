/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
export interface AzureResourceIdentifierQuery {
    query: string;
    subscriptions: string[];
    options?: {
        $skipToken?: string;
    };
}
