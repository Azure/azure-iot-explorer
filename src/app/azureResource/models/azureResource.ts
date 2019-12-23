/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/

import { AccessVerificationState } from './accessVerificationState';
import { AzureResourceIdentifier } from './azureResourceIdentifier';
import { SharedAccessSignatureAuthorizationRule } from './sharedAccessSignatureAuthorizationRule';

export interface AzureResource {
    accessVerificationState: AccessVerificationState;
    azureResourceIdentifier?: AzureResourceIdentifier;
    hostName: string;
    sharedAccessSignatureAuthorizationRules?: SharedAccessSignatureAuthorizationRule[];
    sharedAccessSignatureAuthorizationRulesLastFetched?: string;
    connectionString?: string;
}
