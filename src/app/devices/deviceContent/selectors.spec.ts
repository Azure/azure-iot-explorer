/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import 'jest';
import { Record } from 'immutable';
import { SynchronizationStatus } from './../../api/models/synchronizationStatus';
import {
    getDigitalTwinInterfacePropertiesSelector,
    getDigitalTwinInterfaceNameAndIdsSelector,
    getDigitalTwinInterfaceIdsSelector,
    getIsDevicePnpSelector,
    getInterfaceNameSelector,
    getModuleIdentityListWrapperSelector,
    getModuleIdentityTwinWrapperSelector
} from './selectors';
import { getInitialState } from './../../api/shared/testHelper';
import { ModuleTwin } from '../../api/models/moduleIdentity';

describe('getDigitalTwinInterfacePropertiesSelector', () => {
    const state = getInitialState();
    /* tslint:disable */
    const digitalTwinInterfaceProperties = {
        "interfaces": {
            "urn_azureiot_ModelDiscovery_DigitalTwin": {
                "name": "urn_azureiot_ModelDiscovery_DigitalTwin",
                "properties": {
                    "modelInformation": {
                        "reported": {
                            "value": {
                                "modelId": "urn:contoso:com:dcm:2",
                                "interfaces": {
                                    "environmentalsensor": "urn:contoso:com:environmentalsensor:2",
                                    "urn_azureiot_ModelDiscovery_ModelInformation": "urn:azureiot:ModelDiscovery:ModelInformation:1",
                                    "urn_azureiot_ModelDiscovery_DigitalTwin": "urn:azureiot:ModelDiscovery:DigitalTwin:1"
                                }
                            }
                        }
                    }
                }
            }
        },
        "version": 1
    };

    const moduleIdentityTwin: ModuleTwin = {
        deviceId: 'deviceId',
        moduleId: 'moduleId',
        etag: 'AAAAAAAAAAE=',
        deviceEtag: 'AAAAAAAAAAE=',
        status: 'enabled',
        statusUpdateTime: '0001-01-01T00:00:00Z',
        lastActivityTime: '0001-01-01T00:00:00Z',
        x509Thumbprint:  {primaryThumbprint: null, secondaryThumbprint: null},
        version: 1,
        connectionState: 'Disconnected',
        cloudToDeviceMessageCount: 0,
        authenticationType:'sas',
        properties: {}
    }
    /* tslint:enable */
    state.deviceContentState = Record({
        deviceIdentity: null,
        deviceTwin: null,
        digitalTwinInterfaceProperties: {
            digitalTwinInterfaceProperties,
            digitalTwinInterfacePropertiesSyncStatus: SynchronizationStatus.fetched
        },
        interfaceIdSelected: 'urn:contoso:com:environmentalsensor:2',
        modelDefinitionWithSource: null,
        moduleIdentityList: {
            moduleIdentities: [{
                    authentication: null,
                    deviceId: 'testDevice',
                    moduleId: 'testModule'
                }],
            synchronizationStatus: SynchronizationStatus.working
        },
        moduleIdentityTwin: {
            moduleIdentityTwin,
            synchronizationStatus: SynchronizationStatus.working
        }
    })();

    it('returns interface properties', () => {
        expect(getDigitalTwinInterfacePropertiesSelector(state)).toEqual(digitalTwinInterfaceProperties);
    });

    it('returns name and ids', () => {
        /* tslint:disable */
        const result = {
            "environmentalsensor": "urn:contoso:com:environmentalsensor:2",
            "urn_azureiot_ModelDiscovery_ModelInformation": "urn:azureiot:ModelDiscovery:ModelInformation:1",
            "urn_azureiot_ModelDiscovery_DigitalTwin": "urn:azureiot:ModelDiscovery:DigitalTwin:1"
        }
        /* tslint:enable */
        expect(getDigitalTwinInterfaceNameAndIdsSelector(state)).toEqual(result);
    });

    it('returns ids', () => {
        /* tslint:disable */
        const result = ["urn:contoso:com:environmentalsensor:2",
            "urn:azureiot:ModelDiscovery:ModelInformation:1",
            "urn:azureiot:ModelDiscovery:DigitalTwin:1"];
        /* tslint:enable */
        expect(getDigitalTwinInterfaceIdsSelector(state)).toEqual(result);
    });

    it('returns is device pnp', () => {
        expect(getIsDevicePnpSelector(state)).toEqual(true);
    });

    it('returns interfaceName', () => {
        expect(getInterfaceNameSelector(state)).toEqual('environmentalsensor');
    });

    it('returns module identity list wrapper', () => {
        expect(getModuleIdentityListWrapperSelector(state)).toEqual({
            moduleIdentities: [{
                authentication: null,
                deviceId: 'testDevice',
                moduleId: 'testModule'
            }],
            synchronizationStatus: SynchronizationStatus.working
        });
    });

    it('returns module twin wrapper', () => {
        expect(getModuleIdentityTwinWrapperSelector(state)).toEqual({
            moduleIdentityTwin,
            synchronizationStatus: SynchronizationStatus.working
        });
    });
});
