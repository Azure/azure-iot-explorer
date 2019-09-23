/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import 'jest';
import { generateConnectionString, generateX509ConnectionString, getDeviceAuthenticationType } from './deviceIdentityHelper';
import { DeviceIdentity } from '../../../../api/models/deviceIdentity';
import { DeviceAuthenticationType } from '../../../../api/models/deviceAuthenticationType';

describe('deviceIdentityHelper', () => {
    describe('generateConnectionString', () => {
        it('generates a symmetric key connection string', () => {
            expect(generateConnectionString("HostName=test.azure-devices.net;SharedAccessKeyName=test;SharedAccessKey=test;", "testDevice", "testKey")).toEqual("HostName=test.azure-devices.net;DeviceId=testDevice;SharedAccessKey=testKey");
        });
    });
    describe('generateX509ConnectionString', () => {
        it('generates a connection string for CA/self-signed certs', () => {
            expect(generateX509ConnectionString("HostName=test.azure-devices.net;SharedAccessKeyName=test;SharedAccessKey=test;", "testDevice")).toEqual("HostName=test.azure-devices.net;DeviceId=testDevice;x509=true");
        });
    });
    describe('getDeviceAuthenticationType', () => {
        const testIdentity: DeviceIdentity = {
            authentication: {
                symmetricKey: {
                    primaryKey: '',
                    secondaryKey: ''
                },
                type: '',
                x509Thumbprint: {
                    primaryThumbprint: '',
                    secondaryThumbprint: ''
                }
            },
            capabilities: {
                iotEdge: false
            },
            cloudToDeviceMessageCount: 0,
            deviceId: 'testIdentity',
            etag: '',
            lastActivityTime: '',
            status: '',
            statusReason: '',
            statusUpdatedTime: ''
        };
        it('returns CACertificate', () => {
            const caIdentity = {...testIdentity};
            caIdentity.authentication.type = 'certificateAuthority';
            expect(getDeviceAuthenticationType(caIdentity)).toEqual(DeviceAuthenticationType.CACertificate);
        });
        it('returns SymmetricKey', () => {
            const symmetricIdentity = {...testIdentity};
            symmetricIdentity.authentication.type = 'sas';
            expect(getDeviceAuthenticationType(symmetricIdentity)).toEqual(DeviceAuthenticationType.SymmetricKey);
        });
        it('returns SelfSigned', () => {
            const selfSignedIdentity = {...testIdentity};
            selfSignedIdentity.authentication.type = 'selfSigned';
            expect(getDeviceAuthenticationType(selfSignedIdentity)).toEqual(DeviceAuthenticationType.SelfSigned);
        });
        it('returns None', () => {
            const noneIdentity = { ...testIdentity};
            noneIdentity.authentication.type = '';
            expect(getDeviceAuthenticationType(noneIdentity)).toEqual(DeviceAuthenticationType.None);
        })
    })

})