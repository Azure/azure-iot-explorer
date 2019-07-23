/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import 'jest';
import { Record } from 'immutable';
import { ModelDefinition, PropertyContent } from '../../../../api/models/modelDefinition';
import { SynchronizationStatus } from '../../../../api/models/synchronizationStatus';
import { generateDigitalTwinForSpecificProperty, generateReportedTwin } from './selectors';
import { getInitialState } from '../../../../api/shared/testHelper';

describe('getDigitalTwinInterfacePropertiesSelector', () => {
    const state = getInitialState();
    const interfaceId = 'urn:azureiot:ModelDiscovery:DigitalTwin:1';
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
                                    "urn_azureiot_ModelDiscovery_DigitalTwin": interfaceId
                                }
                            }
                        }
                    }
                }
            }
        },
        "version": 1
    };

    const modelDefinition: ModelDefinition = {
        "@id": interfaceId,
        "@type": "Interface",
        "displayName": "Digital Twin",
        "contents": [
            {
                "@type": "Property",
                "name": "modelInformation",
                "displayName": "Model Information",
                "description": "Providing model and optional interfaces information on a digital twin.",
                "schema": {
                    "@type": "Object",
                    "fields": [
                        {
                            "name": "modelId",
                            "schema": "string"
                        },
                        {
                            "name": "interfaces",
                            "schema": {
                                "@type": "Map",
                                "mapKey": {
                                    "name": "name",
                                    "schema": "string"
                                },
                                "mapValue": {
                                    "name": "schema",
                                    "schema": "string"
                                }
                            }
                        }
                    ]
                }
            }
        ],
        "@context": "http://azureiot.com/v1/contexts/Interface.json"
    }
    /* tslint:enable */

    state.deviceContentState = Record({
        deviceIdentity: null,
        deviceTwin: null,
        digitalTwinInterfaceProperties: {
            digitalTwinInterfaceProperties,
            digitalTwinInterfacePropertiesSyncStatus: SynchronizationStatus.fetched
        },
        interfaceIdSelected: interfaceId,
        invokeMethodResponse: '',
        modelDefinitionWithSource: {
            modelDefinition: null,
            modelDefinitionSynchronizationStatus: SynchronizationStatus.fetched,
            source: null
        }
    })();

    it('returns interface properties', () => {
        expect(generateDigitalTwinForSpecificProperty(state, modelDefinition.contents[0] as PropertyContent))
            .toEqual(digitalTwinInterfaceProperties.interfaces.urn_azureiot_ModelDiscovery_DigitalTwin.properties.modelInformation);
    });

    it('returns interface properties', () => {
        expect(generateReportedTwin(state, modelDefinition.contents[0] as PropertyContent))
            .toEqual(digitalTwinInterfaceProperties.interfaces.urn_azureiot_ModelDiscovery_DigitalTwin.properties.modelInformation.reported.value);
    });
});
