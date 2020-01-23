/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
export interface AzureResourceIdentifierQueryResult {
    $skipToken?: string;
    count: number;
    data: {
        columns: Array<{ name: string; type: string; }>;
        rows: Array<[]>;
    };
    totalRecords: number;
}
