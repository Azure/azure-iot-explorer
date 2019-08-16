/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import 'jest';
import { transformModelDefinition } from './modelDefinitionTransform';
import { ModelDefinition } from './../models/modelDefinition';

describe('modelDefinitionTransform', () => {

    /* tslint:disable */
    const modelDefinitionTransformed: ModelDefinition = {
        "@id": "urn:azureiot:ModelDiscovery:ModelInformation:1",
        "@type": "Interface",
        "displayName": "Model Information",
        "description": "Model Information description",
        "contents": [
        {
            "@type": "Telemetry",
            "name": "modelInformation",
            "displayName": "Model Information ",
            "description": "Ids for the capability model and interfaces implemented on the device.",
            "schema": {
                "@type": "Object",
                "fields": [
                    {
                        "name": "capabilityModelId",
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
        }],
        "@context": "http://azureiot.com/v1/contexts/Interface.json"
    };
    /* tslint:enable */

    describe('transformModelDefinition', () => {
        it('transforms ModelDefinition to localized ModelDefinition', () => {
            const modelDefinition1 = {
                ...modelDefinitionTransformed,
                description: 'Model Information description',
                displayName: 'Model Information'
            };
            expect(transformModelDefinition(modelDefinition1)).toEqual(modelDefinitionTransformed);
            const modelDefinition2 = {
                ...modelDefinitionTransformed,
                description: {en: 'Model Information description'},
                displayName: {zh: 'Model Information'}
            };
            modelDefinitionTransformed.displayName = '';
            expect(transformModelDefinition(modelDefinition2)).toEqual(modelDefinitionTransformed);
        });
    });
});
