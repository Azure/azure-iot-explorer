/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { ModelDefinition } from '../../../../api/models/modelDefinition';
import { PnpStateInterface, pnpStateInitial } from '../../state';
import { SynchronizationStatus } from '../../../../api/models/synchronizationStatus';
import { REPOSITORY_LOCATION_TYPE } from '../../../../constants/repositoryLocationTypes';

const interfaceId = 'urn:azureiot:samplemodel;1';
export const testComponentName = 'environmentalSensor';
/* tslint:disable */
export const modelInformationReportedValue = {
    "modelId": "urn:contoso:com:dcm:2",
    "interfaces": {
        "urn_azureiot_ModelDiscovery_ModelInformation": "urn:azureiot:ModelDiscovery:ModelInformation:1",
        componentName: interfaceId
    }
};

export const testTwin: any = {
    "deviceId": "testDevice",
    "$modelId": interfaceId,
    properties: {
        reported: {
            modelInformation: modelInformationReportedValue
        }
    }
};

testTwin.properties.reported[testComponentName] = {
    "modelInformation": modelInformationReportedValue,  // component level model information
    "__t": "c"
};

const sampleSenmanticProperty = {
    '@type': [
        "Property",
        "SemanticType/Brightness Level"
        ],
    displayName: 'Brightness Level',
    description: 'The brightness level for the light on the device. Can be specified as 1 (high), 2 (medium), 3 (low)',
    name: 'brightness',
    schema: 'long'
};

export const testModelDefinition: ModelDefinition = {
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
    "@context": "https://azureiot.com/v1/contexts/Interface.json"
}

export const pnpStateWithTestData: PnpStateInterface = {
    ...pnpStateInitial(),
    modelDefinitionWithSource: {
        synchronizationStatus: SynchronizationStatus.fetched,
        payload: {
            modelDefinition: testModelDefinition,
            source: REPOSITORY_LOCATION_TYPE.Local,
            isModelValid: true
        },
    },
    twin: {
        payload: testTwin,
        synchronizationStatus: SynchronizationStatus.fetched
    }
}
