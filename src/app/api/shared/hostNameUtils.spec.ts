import {  getResourceNameFromHostName, getResourceTypeFromHostName } from './hostNameUtils';
import { AzureResourceIdentifierType } from '../../azureResourceIdentifier/models/azureResourceIdentifierType';

describe('getResourceNameFromHostName', () => {
    it('returns resource name given propertly formed hostName', () => {
        expect(getResourceNameFromHostName('resourceName1.azure-devices.net')).toEqual('resourceName1');
    });

    it('returns undefined given undefined', () => {
        expect(getResourceNameFromHostName(undefined)).toBeUndefined();
    });

    it('returns undefined given empty string', () => {
        expect(getResourceNameFromHostName('')).toBeUndefined();
    });
});

describe('getResourceTypeFromHostName', () => {
    it('returns iot hub resource type given iot hub host name', () => {
        expect(getResourceTypeFromHostName('resourceName1.azure-devices.net')).toEqual(AzureResourceIdentifierType.IoTHub);
    });

    it('returns device provisioning service given device provisioning host name', () => {
        expect(getResourceTypeFromHostName('resourceName1.azure-devices-provisioning.net')).toEqual(AzureResourceIdentifierType.DeviceProvisioningService);
    });

    it('returns undefined when host name is unknown', () => {
        expect(getResourceTypeFromHostName('resourceName1.azure-devices-twins.net')).toBeUndefined();
    });

    it('returns undefined given undefined', () => {
        expect(getResourceTypeFromHostName(undefined)).toBeUndefined();
    });

    it('returns undefined given empty string', () => {
        expect(getResourceTypeFromHostName('')).toBeUndefined();
    });
});
