/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
export interface BulkRegistryOperationResult {
    isSuccessful: boolean;
    errors: string[];
    warnings: string[];
}
