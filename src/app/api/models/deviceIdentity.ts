/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
export interface DeviceIdentity {
    etag: string;
    deviceId: string;
    status: string;
    lastActivityTime: string;
    statusUpdatedTime: string;
    statusReason: string;
    authentication: AuthenticationCredentials;
    capabilities: DeviceCapabilities;
    cloudToDeviceMessageCount: string;
    deviceScope?: string;
}

export interface DeviceCapabilities {
    iotEdge: boolean;
}

export interface AuthenticationCredentials {
    symmetricKey: SymmetricKeyAuthenticationProfile;
    x509Thumbprint: X509AuthenticationProfile;
    type: string;
}

export interface SymmetricKeyAuthenticationProfile {
    primaryKey: string;
    secondaryKey: string;
}

export interface X509AuthenticationProfile {
    primaryThumbprint: string;
    secondaryThumbprint: string;
}
