/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import 'jest';
import {
    validateAzureIoTHostname,
    validateEventHubHostname,
    extractEventHubHostname
} from './urlValidator';

describe('validateAzureIoTHostname', () => {
    describe('valid hostnames', () => {
        it('accepts standard IoT Hub hostname', () => {
            expect(validateAzureIoTHostname('myhub.azure-devices.net')).toBe(true);
        });

        it('accepts hostname with hyphens', () => {
            expect(validateAzureIoTHostname('my-iot-hub.azure-devices.net')).toBe(true);
        });

        it('accepts hostname with numbers', () => {
            expect(validateAzureIoTHostname('hub123.azure-devices.net')).toBe(true);
        });

        it('accepts uppercase (normalized to lowercase)', () => {
            expect(validateAzureIoTHostname('MyHub.Azure-Devices.Net')).toBe(true);
        });

        it('accepts Private Link hostname', () => {
            expect(validateAzureIoTHostname('myhub.privatelink.azure-devices.net')).toBe(true);
        });

        it('accepts Private Link hostname with hyphens', () => {
            expect(validateAzureIoTHostname('my-hub-01.privatelink.azure-devices.net')).toBe(true);
        });

        // Azure China (21Vianet)
        it('accepts Azure China IoT Hub hostname', () => {
            expect(validateAzureIoTHostname('myhub.azure-devices.cn')).toBe(true);
        });

        it('accepts Azure China Private Link hostname', () => {
            expect(validateAzureIoTHostname('myhub.privatelink.azure-devices.cn')).toBe(true);
        });

        // Azure US Government
        it('accepts Azure US Gov IoT Hub hostname', () => {
            expect(validateAzureIoTHostname('myhub.azure-devices.us')).toBe(true);
        });

        it('accepts Azure US Gov Private Link hostname', () => {
            expect(validateAzureIoTHostname('myhub.privatelink.azure-devices.us')).toBe(true);
        });

        // TLS 1.3 device/service hostnames
        it('accepts device hostname (TLS 1.3)', () => {
            expect(validateAzureIoTHostname('myhub.device.azure-devices.net')).toBe(true);
        });

        it('accepts service hostname (TLS 1.3)', () => {
            expect(validateAzureIoTHostname('myhub.service.azure-devices.net')).toBe(true);
        });

        it('accepts Azure China device hostname (TLS 1.3)', () => {
            expect(validateAzureIoTHostname('myhub.device.azure-devices.cn')).toBe(true);
        });

        it('accepts Azure China service hostname (TLS 1.3)', () => {
            expect(validateAzureIoTHostname('myhub.service.azure-devices.cn')).toBe(true);
        });

        it('accepts Azure US Gov device hostname (TLS 1.3)', () => {
            expect(validateAzureIoTHostname('myhub.device.azure-devices.us')).toBe(true);
        });

        it('accepts Azure US Gov service hostname (TLS 1.3)', () => {
            expect(validateAzureIoTHostname('myhub.service.azure-devices.us')).toBe(true);
        });

        // TLS 1.3 device/service + Private Link hostnames
        it('accepts device Private Link hostname (TLS 1.3)', () => {
            expect(validateAzureIoTHostname('myhub.device.privatelink.azure-devices.net')).toBe(true);
        });

        it('accepts service Private Link hostname (TLS 1.3)', () => {
            expect(validateAzureIoTHostname('myhub.service.privatelink.azure-devices.net')).toBe(true);
        });

        it('accepts Azure China device Private Link hostname (TLS 1.3)', () => {
            expect(validateAzureIoTHostname('myhub.device.privatelink.azure-devices.cn')).toBe(true);
        });

        it('accepts Azure US Gov service Private Link hostname (TLS 1.3)', () => {
            expect(validateAzureIoTHostname('myhub.service.privatelink.azure-devices.us')).toBe(true);
        });
    });

    describe('invalid hostnames — attacker-controlled', () => {
        it('rejects attacker domain', () => {
            expect(validateAzureIoTHostname('evil.com')).toBe(false);
        });

        it('rejects domain that does not end with azure-devices.net', () => {
            expect(validateAzureIoTHostname('myhub.not-azure-devices.net')).toBe(false);
        });

        it('rejects domain with extra subdomain (spoofing)', () => {
            expect(validateAzureIoTHostname('evil.myhub.azure-devices.net')).toBe(false);
        });

        it('rejects hostname ending with azure-devices.net but with wrong subdomain pattern', () => {
            expect(validateAzureIoTHostname('myhub.fakelink.azure-devices.net')).toBe(false);
        });

        it('rejects attacker domain appended after valid suffix', () => {
            expect(validateAzureIoTHostname('myhub.azure-devices.net.evil.com')).toBe(false);
        });
    });

    describe('invalid hostnames — IP addresses', () => {
        it('rejects loopback IPv4', () => {
            expect(validateAzureIoTHostname('127.0.0.1')).toBe(false);
        });

        it('rejects private IP (RFC 1918)', () => {
            expect(validateAzureIoTHostname('192.168.1.1')).toBe(false);
            expect(validateAzureIoTHostname('10.0.0.1')).toBe(false);
        });

        it('rejects cloud metadata endpoint', () => {
            expect(validateAzureIoTHostname('169.254.169.254')).toBe(false);
        });
    });

    describe('invalid hostnames — injection attacks', () => {
        it('rejects path injection with slash', () => {
            expect(validateAzureIoTHostname('myhub.azure-devices.net/evil')).toBe(false);
        });

        it('rejects path injection with backslash', () => {
            expect(validateAzureIoTHostname('myhub.azure-devices.net\\evil')).toBe(false);
        });

        it('rejects encoded path injection', () => {
            expect(validateAzureIoTHostname('myhub.azure-devices.net%2Fevil')).toBe(false);
        });

        it('rejects credential injection with @', () => {
            expect(validateAzureIoTHostname('user@myhub.azure-devices.net')).toBe(false);
        });

        it('rejects port injection with :', () => {
            expect(validateAzureIoTHostname('myhub.azure-devices.net:5671')).toBe(false);
        });
    });

    describe('invalid hostnames — edge cases', () => {
        it('rejects empty string', () => {
            expect(validateAzureIoTHostname('')).toBe(false);
        });

        it('rejects null', () => {
            expect(validateAzureIoTHostname(null as any)).toBe(false);
        });

        it('rejects undefined', () => {
            expect(validateAzureIoTHostname(undefined as any)).toBe(false);
        });

        it('rejects bare suffix with no hub name', () => {
            expect(validateAzureIoTHostname('.azure-devices.net')).toBe(false);
        });

        it('rejects hub name starting with hyphen', () => {
            expect(validateAzureIoTHostname('-myhub.azure-devices.net')).toBe(false);
        });

        it('rejects hub name ending with hyphen', () => {
            expect(validateAzureIoTHostname('myhub-.azure-devices.net')).toBe(false);
        });

        it('rejects just the suffix without subdomain', () => {
            expect(validateAzureIoTHostname('azure-devices.net')).toBe(false);
        });
    });
});

describe('validateEventHubHostname', () => {
    describe('valid hostnames', () => {
        it('accepts standard Event Hubs hostname', () => {
            expect(validateEventHubHostname('mynamespace.servicebus.windows.net')).toBe(true);
        });

        it('accepts hostname with hyphens', () => {
            expect(validateEventHubHostname('my-namespace.servicebus.windows.net')).toBe(true);
        });

        it('accepts hostname with numbers', () => {
            expect(validateEventHubHostname('ns123.servicebus.windows.net')).toBe(true);
        });

        it('accepts uppercase (normalized to lowercase)', () => {
            expect(validateEventHubHostname('MyNamespace.ServiceBus.Windows.Net')).toBe(true);
        });

        it('accepts Private Link hostname', () => {
            expect(validateEventHubHostname('mynamespace.privatelink.servicebus.windows.net')).toBe(true);
        });

        it('accepts Private Link hostname with hyphens', () => {
            expect(validateEventHubHostname('my-ns-01.privatelink.servicebus.windows.net')).toBe(true);
        });

        // Azure China (21Vianet)
        it('accepts Azure China Event Hubs hostname', () => {
            expect(validateEventHubHostname('mynamespace.servicebus.chinacloudapi.cn')).toBe(true);
        });

        it('accepts Azure China Private Link hostname', () => {
            expect(validateEventHubHostname('mynamespace.privatelink.servicebus.chinacloudapi.cn')).toBe(true);
        });

        // Azure US Government
        it('accepts Azure US Gov Event Hubs hostname', () => {
            expect(validateEventHubHostname('mynamespace.servicebus.usgovcloudapi.net')).toBe(true);
        });

        it('accepts Azure US Gov Private Link hostname', () => {
            expect(validateEventHubHostname('mynamespace.privatelink.servicebus.usgovcloudapi.net')).toBe(true);
        });
    });

    describe('invalid hostnames — attacker-controlled', () => {
        it('rejects attacker domain', () => {
            expect(validateEventHubHostname('evil.com')).toBe(false);
        });

        it('rejects attacker-controlled-host.com', () => {
            expect(validateEventHubHostname('attacker-controlled-host.com')).toBe(false);
        });

        it('rejects domain that does not end with servicebus.windows.net', () => {
            expect(validateEventHubHostname('mynamespace.not-servicebus.windows.net')).toBe(false);
        });

        it('rejects domain with extra subdomain (spoofing)', () => {
            expect(validateEventHubHostname('evil.mynamespace.servicebus.windows.net')).toBe(false);
        });

        it('rejects hostname with wrong privatelink position', () => {
            expect(validateEventHubHostname('mynamespace.fakelink.servicebus.windows.net')).toBe(false);
        });

        it('rejects attacker domain appended after valid suffix', () => {
            expect(validateEventHubHostname('mynamespace.servicebus.windows.net.evil.com')).toBe(false);
        });

        it('rejects just the suffix without namespace', () => {
            expect(validateEventHubHostname('servicebus.windows.net')).toBe(false);
        });
    });

    describe('invalid hostnames — IP addresses', () => {
        it('rejects loopback IPv4', () => {
            expect(validateEventHubHostname('127.0.0.1')).toBe(false);
        });

        it('rejects private IP (RFC 1918)', () => {
            expect(validateEventHubHostname('192.168.1.1')).toBe(false);
            expect(validateEventHubHostname('10.0.0.1')).toBe(false);
        });

        it('rejects cloud metadata endpoint', () => {
            expect(validateEventHubHostname('169.254.169.254')).toBe(false);
        });
    });

    describe('invalid hostnames — injection attacks', () => {
        it('rejects path injection with slash', () => {
            expect(validateEventHubHostname('mynamespace.servicebus.windows.net/evil')).toBe(false);
        });

        it('rejects path injection with backslash', () => {
            expect(validateEventHubHostname('mynamespace.servicebus.windows.net\\evil')).toBe(false);
        });

        it('rejects encoded path injection', () => {
            expect(validateEventHubHostname('mynamespace.servicebus.windows.net%2Fevil')).toBe(false);
        });

        it('rejects credential injection with @', () => {
            expect(validateEventHubHostname('user@mynamespace.servicebus.windows.net')).toBe(false);
        });

        it('rejects port injection with :', () => {
            expect(validateEventHubHostname('mynamespace.servicebus.windows.net:5671')).toBe(false);
        });
    });

    describe('invalid hostnames — edge cases', () => {
        it('rejects empty string', () => {
            expect(validateEventHubHostname('')).toBe(false);
        });

        it('rejects null', () => {
            expect(validateEventHubHostname(null as any)).toBe(false);
        });

        it('rejects undefined', () => {
            expect(validateEventHubHostname(undefined as any)).toBe(false);
        });

        it('rejects bare suffix with no namespace', () => {
            expect(validateEventHubHostname('.servicebus.windows.net')).toBe(false);
        });

        it('rejects namespace starting with hyphen', () => {
            expect(validateEventHubHostname('-mynamespace.servicebus.windows.net')).toBe(false);
        });

        it('rejects namespace ending with hyphen', () => {
            expect(validateEventHubHostname('mynamespace-.servicebus.windows.net')).toBe(false);
        });
    });
});

describe('extractEventHubHostname', () => {
    it('extracts hostname from valid connection string', () => {
        const connStr = 'Endpoint=sb://mynamespace.servicebus.windows.net/;SharedAccessKeyName=test;SharedAccessKey=dGVzdA==';
        expect(extractEventHubHostname(connStr)).toBe('mynamespace.servicebus.windows.net');
    });

    it('extracts hostname without trailing slash', () => {
        const connStr = 'Endpoint=sb://mynamespace.servicebus.windows.net;SharedAccessKeyName=test;SharedAccessKey=dGVzdA==';
        expect(extractEventHubHostname(connStr)).toBe('mynamespace.servicebus.windows.net');
    });

    it('extracts hostname from attacker connection string', () => {
        const connStr = 'Endpoint=sb://attacker-controlled-host.com;SharedAccessKeyName=test;SharedAccessKey=dGVzdA==';
        expect(extractEventHubHostname(connStr)).toBe('attacker-controlled-host.com');
    });

    it('throws on empty string', () => {
        expect(() => extractEventHubHostname('')).toThrow('missing or empty');
    });

    it('throws on null', () => {
        expect(() => extractEventHubHostname(null as any)).toThrow('missing or empty');
    });

    it('throws on connection string without Endpoint', () => {
        expect(() => extractEventHubHostname('SharedAccessKeyName=test;SharedAccessKey=dGVzdA==')).toThrow('unable to extract');
    });

    it('is case-insensitive for Endpoint prefix', () => {
        const connStr = 'endpoint=sb://mynamespace.servicebus.windows.net/;SharedAccessKeyName=test;SharedAccessKey=dGVzdA==';
        expect(extractEventHubHostname(connStr)).toBe('mynamespace.servicebus.windows.net');
    });
});
