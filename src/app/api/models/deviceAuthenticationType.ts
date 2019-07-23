/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
export enum DeviceAuthenticationType {
    SelfSigned = 'selfSigned',
    SymmetricKey =  'sas',
    CACertificate = 'certificateAuthority',
    None = 'none'
}
