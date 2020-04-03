/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import 'jest';
import { Record } from 'immutable';
import { SynchronizationStatus } from './../../api/models/synchronizationStatus';
import {
    getDigitalTwinInterfacePropertiesSelector,
    getDigitalTwinInterfaceIdsSelector,
    getDigitalTwinModelId,
    getComponentNameSelector,
    getDigitalTwinComponentNameAndIdsSelector,
    getDigitalTwinSynchronizationStatusSelector,
    getModelDefinitionWithSourceWrapperSelector,
    getModelDefinitionWithSourceSelector,
    getComponentToInterfaceIdMappingSelector
} from './selectors';
import { getInitialState } from './../../api/shared/testHelper';
import { REPOSITORY_LOCATION_TYPE } from '../../constants/repositoryLocationTypes';

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
    const digitalTwin = {
        "$dtId": "testDevice",
        "environmentalSensor": {
          "state": true,
          "$metadata": {
            "state": {
              "lastUpdateTime": "2020-03-31T23:17:42.4813073Z"
            }
          }
        },
        "$metadata": {
          "$model": "urn:azureiot:samplemodel:1"
        }
    };
    const modelDefinition ={
        "@id": "dtmi:plugnplay:hube2e:cm;1",
        "@type": "Interface",
        "displayName": "IoT Hub E2E Tests",
            "contents": [
                {
                    "@type": "Component",
                    "name": "deviceInformation",
                    "schema": "dtmi:__DeviceManagement:DeviceInformation;1"
                },
                {
                    "@type": "Component",
                    "name": "sdkInfo",
                    "schema": "dtmi:__Client:SDKInformation;1"
                },
                {
                    "@type": "Component",
                    "name": "environmentalSensor",
                    "schema": "dtmi:__Contoso:EnvironmentalSensor;1"
                }
            ],
            "@context": "dtmi:dtdl:context;2"
        };
    /* tslint:enable */
    state.deviceContentState = Record({
        componentNameSelected: 'environmentalsensor',
        deviceIdentity: null,
        deviceTwin: null,
        digitalTwin: {
            payload: digitalTwin,
            synchronizationStatus: SynchronizationStatus.fetched
        },
        digitalTwinInterfaceProperties: {
            payload: digitalTwinInterfaceProperties,
            synchronizationStatus: SynchronizationStatus.fetched
        },
        modelDefinitionWithSource: {
            payload: {
                isModelValid: true,
                modelDefinition,
                source: REPOSITORY_LOCATION_TYPE.Local
            },
            synchronizationStatus: SynchronizationStatus.fetched
        }
    })();

    it('returns componentName', () => {
        expect(getComponentNameSelector(state)).toEqual('environmentalsensor');
    });

    it('returns model definition with source wrapper', () => {
        expect(getModelDefinitionWithSourceWrapperSelector(state)).toEqual({
            payload: {
                isModelValid: true,
                modelDefinition,
                source: REPOSITORY_LOCATION_TYPE.Local
            },
            synchronizationStatus: SynchronizationStatus.fetched
        });
    });

    it('returns model definition with source', () => {
        expect(getModelDefinitionWithSourceSelector(state)).toEqual({
            isModelValid: true,
                modelDefinition,
                source: REPOSITORY_LOCATION_TYPE.Local
        });
    });

    it('returns component to interface mapping from model definition', () => {
        expect(getComponentToInterfaceIdMappingSelector(state)).toEqual([
            {componentName: 'deviceInformation', interfaceId: 'dtmi:__DeviceManagement:DeviceInformation;1'},
            {componentName: 'sdkInfo', interfaceId: 'dtmi:__Client:SDKInformation;1'},
            {componentName: 'environmentalSensor', interfaceId: 'dtmi:__Contoso:EnvironmentalSensor;1'}]);
    });

    it('returns interface properties', () => {
        expect(getDigitalTwinInterfacePropertiesSelector(state)).toEqual(digitalTwinInterfaceProperties);
    });

    it('returns ids', () => {
        /* tslint:disable */
        const result = ["urn:contoso:com:environmentalsensor:2",
            "urn:azureiot:ModelDiscovery:ModelInformation:1",
            "urn:azureiot:ModelDiscovery:DigitalTwin:1"];
        /* tslint:enable */
        expect(getDigitalTwinInterfaceIdsSelector(state)).toEqual(result);
    });

    it('returns digital twin sync status ', () => {
        expect(getDigitalTwinSynchronizationStatusSelector(state)).toEqual(SynchronizationStatus.fetched);
    });

    it('returns digital twin Model Id ', () => {
        expect(getDigitalTwinModelId(state)).toEqual('urn:azureiot:samplemodel:1');
    });

    it('returns component names and interface ids', () => {
        /* tslint:disable */
        expect(getDigitalTwinComponentNameAndIdsSelector(state)).toEqual({
            "environmentalsensor": "urn:contoso:com:environmentalsensor:2",
            "urn_azureiot_ModelDiscovery_ModelInformation": "urn:azureiot:ModelDiscovery:ModelInformation:1",
            "urn_azureiot_ModelDiscovery_DigitalTwin": "urn:azureiot:ModelDiscovery:DigitalTwin:1"
        });
        /* tslint:enable */
    });
});
