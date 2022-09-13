/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
export interface SharedAccessSignatureAuthorizationRule {
    keyName: string;
    primaryKey: string;
    rights: string;
}

export enum AccessRights {
    RegistryWrite = 'RegistryWrite',
    ServiceConnect = 'ServiceConnect',
    DeviceConnect = 'DeviceConnect'
}
