/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { AccessVerificationState } from './accessVerificationState';
import { AzureResourceIdentifier } from '../../azureResourceIdentifier/models/azureResourceIdentifier';

export interface AzureResource {
    accessVerificationState: AccessVerificationState;
    azureResourceIdentifier?: AzureResourceIdentifier;
    hostName: string;
    connectionString?: string;
}
