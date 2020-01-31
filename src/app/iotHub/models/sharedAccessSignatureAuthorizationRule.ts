/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { AccessRights } from './accessRights';

export interface SharedAccessSignatureAuthorizationRule {
    keyName: string;
    primaryKey?: string;
    secondaryKey?: string;
    rights: AccessRights;
}
