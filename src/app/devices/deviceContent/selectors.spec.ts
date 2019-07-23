/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import 'jest';
import { Record } from 'immutable';
import { SynchronizationStatus } from './../../api/models/synchronizationStatus';
import { getDigitalTwinInterfacePropertiesSelector, getDigitalTwinInterfaceNameAndIdsSelector, getDigitalTwinInterfaceIdsSelector, getIsDevicePnpSelector, getInterfaceNameSelector } from './selectors';
import { getInitialState } from './../../api/shared/testHelper';

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
    /* tslint:enable */
    state.deviceContentState = Record({
        deviceIdentity: null,
        deviceTwin: null,
        digitalTwinInterfaceProperties: {
            digitalTwinInterfaceProperties,
            digitalTwinInterfacePropertiesSyncStatus: SynchronizationStatus.fetched
        },
        interfaceIdSelected: 'urn:contoso:com:environmentalsensor:2',
        invokeMethodResponse: '',
        modelDefinitionWithSource: null
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

    it('returns is correct interfaceName pnp', () => {
        expect(getInterfaceNameSelector(state)).toEqual('environmentalsensor');
    });
});
