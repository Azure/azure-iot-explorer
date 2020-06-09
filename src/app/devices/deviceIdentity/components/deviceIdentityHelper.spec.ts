/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import 'jest';
import { generateConnectionString, generateX509ConnectionString, getDeviceAuthenticationType, generateSASTokenConnectionStringForDevice, generateSASTokenConnectionStringForModuleIdentity } from './deviceIdentityHelper';
import { DeviceIdentity } from '../../../api/models/deviceIdentity';
import { DeviceAuthenticationType } from '../../../api/models/deviceAuthenticationType';
import * as Utils from '../../../api/shared/utils';

describe('deviceIdentityHelper', () => {
    context('generateConnectionString', () => {
        it('generates a symmetric key connection string', () => {
            expect(generateConnectionString('test.azure-devices.net', 'testDevice', 'testKey')).toEqual('HostName=test.azure-devices.net;DeviceId=testDevice;SharedAccessKey=testKey');
        });
    });

    context('generateX509ConnectionString', () => {
        it('generates a connection string for CA/self-signed certs', () => {
            expect(generateX509ConnectionString('test.azure-devices.net', 'testDevice')).toEqual('HostName=test.azure-devices.net;DeviceId=testDevice;x509=true');
        });
    });

    context('getDeviceAuthenticationType', () => {
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
        });
    });

    context('generate SAS token', () => {
        const hostName = 'testHub.azure-devices.net';
        const deviceId = 'testDevice';
        const moduleId = 'testModule';
        const sasToken = 'sasToken';
        jest.spyOn(Utils, 'generateSasToken').mockReturnValue(sasToken);

        it('generateSASTokenConnectionStringForDevice', () => {
            // tslint:disable-next-line:no-magic-numbers
            expect(generateSASTokenConnectionStringForDevice(hostName, deviceId, 5, '')).toEqual(`HostName=${hostName};DeviceId=${deviceId};SharedAccessSignature=${sasToken}`);
        });

        it('generateSASTokenConnectionStringForDevice', () => {
            // tslint:disable-next-line:no-magic-numbers
            expect(generateSASTokenConnectionStringForModuleIdentity(hostName, deviceId, moduleId, 5, '')).toEqual(`HostName=${hostName};DeviceId=${deviceId};ModuleId=${moduleId};SharedAccessSignature=${sasToken}`);
        });
    });

});
