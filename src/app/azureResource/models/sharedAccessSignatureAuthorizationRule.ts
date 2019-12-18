/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/

export interface SharedAccessSignatureAuthorizationRule {
    accessRights: string;
    keyName: string;
    primaryKey: string;
    secondaryKey: string;
}
