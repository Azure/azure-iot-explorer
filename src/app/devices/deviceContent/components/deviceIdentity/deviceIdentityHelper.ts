/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { DeviceIdentity } from '../../../../api/models/deviceIdentity';
import { getConnectionInfoFromConnectionString, generateSasToken } from '../../../../api/shared/utils';
import { DeviceAuthenticationType } from '../../../../api/models/deviceAuthenticationType';

// tslint:disable-next-line:cyclomatic-complexity
export const getDeviceAuthenticationType = (identity: DeviceIdentity): DeviceAuthenticationType => {

    const type = identity && identity.authentication && identity.authentication.type;
    if (typeof (type) === typeof (undefined) || type === null) {
        return DeviceAuthenticationType.None;
    }

    const typeLowerCase = type.toLowerCase();
    switch (typeLowerCase) {
        case DeviceAuthenticationType.CACertificate.toString().toLowerCase():
            return DeviceAuthenticationType.CACertificate;
        case DeviceAuthenticationType.SymmetricKey.toString().toLowerCase():
            return DeviceAuthenticationType.SymmetricKey;
        case DeviceAuthenticationType.SelfSigned.toString().toLowerCase():
            return DeviceAuthenticationType.SelfSigned;
        default:
            return DeviceAuthenticationType.None;
    }
};

export const generateX509ConnectionString = (hostName: string, deviceId: string): string => {
    return hostName && deviceId ?
        `HostName=${hostName};DeviceId=${deviceId};x509=true` : '';
};

export const generateConnectionString = (hostName: string, deviceId: string, key: string): string => {
    return hostName && deviceId && key ?
        `HostName=${hostName};DeviceId=${deviceId};SharedAccessKey=${key}` : '';
};

export const generateSASTokenConnectionString = (hostName: string, deviceId: string, expiration: number, key: string): string => {
    const resourceUri = hostName && deviceId ?
        `${hostName}/devices/${deviceId}` : '';

    const sasToken = generateSasToken({
        expiration,
        key,
        resourceUri
    });

    return hostName && sasToken ?
        `HostName=${hostName};DeviceId=${deviceId};SharedAccessSignature=${sasToken}` : '';
};
