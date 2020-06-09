/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { ModelDefinition } from '../../../../api/models/modelDefinition';
import { PnpStateInterface, pnpStateInitial } from '../../state';
import { SynchronizationStatus } from '../../../../api/models/synchronizationStatus';
import { REPOSITORY_LOCATION_TYPE } from '../../../../constants/repositoryLocationTypes';

const interfaceId = 'urn:azureiot:samplemodel:1';
export const testComponentName = 'environmentalSensor';
/* tslint:disable */
export const testDigitalTwin: any = {
    "$dtId": "testDevice",
    "$metadata": {
        "$model": interfaceId
    }
};

export const modelInformationReportedValue = {
    "modelId": "urn:contoso:com:dcm:2",
    "interfaces": {
        "urn_azureiot_ModelDiscovery_ModelInformation": "urn:azureiot:ModelDiscovery:ModelInformation:1",
        componentName: interfaceId
    }
};
testDigitalTwin[testComponentName] = {
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
    "@context": "http://azureiot.com/v1/contexts/Interface.json"
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
    digitalTwin: {
        payload: testDigitalTwin,
        synchronizationStatus: SynchronizationStatus.fetched
    }
}
