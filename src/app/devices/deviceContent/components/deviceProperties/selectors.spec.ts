/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import 'jest';
import { Record } from 'immutable';
import { ModelDefinition } from '../../../../api/models/modelDefinition';
import { SynchronizationStatus } from '../../../../api/models/synchronizationStatus';
import { getDevicePropertyTupleSelector, filterProperties } from './selectors';
import { getInitialState } from '../../../../api/shared/testHelper';

describe('getDigitalTwinPropertiesSelector', () => {
    const state = getInitialState();
    const interfaceId = 'urn:azureiot:ModelDiscovery:DigitalTwin:1';
    const componentName = 'urn_azureiot_ModelDiscovery_DigitalTwin';
    /* tslint:disable */
    const digitalTwin = {
        "$dtId": "testDevice",
        "$metadata": {
            "$model": interfaceId
        }
    };
    const modelInformationReportedValue = {
        "modelId": "urn:contoso:com:dcm:2",
        "interfaces": {
            "urn_azureiot_ModelDiscovery_ModelInformation": "urn:azureiot:ModelDiscovery:ModelInformation:1",
            componentName: interfaceId
        }
    };
    digitalTwin[componentName] = {
        "modelInformation": modelInformationReportedValue,
        "$metadata": {
            "modelInformation": {
                "lastUpdateTime": "2020-03-31T23:17:42.4813073Z"
            }
        }
    };

    const sampleSenmanticProperty = {
        '@type': [
            "Property",
            "SemanticType/Brightness Level"
          ],
        displayName: 'Brightness Level',
        description: 'The brightness level for the light on the device. Can be specified as 1 (high), 2 (medium), 3 (low)',
        name: 'brightness',
        writable: false,
        schema: 'long'
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
            },
            sampleSenmanticProperty
        ],
        "@context": "http://azureiot.com/v1/contexts/Interface.json"
    }
    /* tslint:enable */

    state.deviceContentState = Record({
        componentNameSelected: componentName,
        deviceIdentity: null,
        deviceTwin: null,
        digitalTwin: {
            payload:  digitalTwin,
            synchronizationStatus: SynchronizationStatus.fetched,
        },
        modelDefinitionWithSource: {
            payload: {
                isModelValid: true,
                modelDefinition,
                source: null
            },
            synchronizationStatus: SynchronizationStatus.fetched,
        }
    })();

    it('filters readonly property with semantic types', () => {
        expect(filterProperties(sampleSenmanticProperty)).toBeTruthy();
    });

    it('returns interface properties tuple', () => {
        const result = getDevicePropertyTupleSelector(state);
        expect(result[0].propertyModelDefinition).toEqual(modelDefinition.contents[0]);
        expect(result[0].reportedTwin).toEqual(modelInformationReportedValue);
        expect(result[0].propertySchema.description).toEqual(`${modelDefinition.contents[0].displayName} / ${modelDefinition.contents[0].description}`);
        expect(result[0].propertySchema.title).toEqual(modelDefinition.contents[0].name);
    });
});
