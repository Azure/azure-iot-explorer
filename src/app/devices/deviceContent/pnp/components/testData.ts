/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { ModelDefinition } from '../../../../api/models/modelDefinition';
import { PnpStateInterface, pnpStateInitial } from '../state';
import { SynchronizationStatus } from '../../../../api/models/synchronizationStatus';
import { REPOSITORY_LOCATION_TYPE } from '../../../../constants/repositoryLocationTypes';

const interfaceId = 'urn:azureiot:samplemodel:1';

/* tslint:disable */
export const testDigitalTwin: any = {
    "$dtId": "testDevice",
    "$metadata": {
        "$model": interfaceId
    },
    environmentalSensor: {
        "brightness": 123,
        "$metadata": {
            "brightness": {
                "desiredValue": 456,
                "desiredVersion": 2,
                "lastUpdateTime": "2020-03-31T23:17:42.4813073Z"
            }
        }
    }

};

const brightnessProperty = {
    '@type': 'Property',
    displayName: 'Brightness Level',
    description: 'The brightness level for the light on the device. Can be specified as 1 (high), 2 (medium), 3 (low)',
    name: 'brightness',
    writable: true,
    schema: 'long'
};

const sampleSenmanticProperty = {
    '@type': [
        "Property",
        "SemanticType/Brightness Level"
        ],
    displayName: 'Brightness Level',
    description: 'The brightness level for the light on the device. Can be specified as 1 (high), 2 (medium), 3 (low)',
    name: 'brightness',
    writable: true,
    schema: 'long'
};

export const testModelDefinition: ModelDefinition = {
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

export const pnpStateWithTestData: PnpStateInterface = {
    ...pnpStateInitial(),
    modelDefinitionWithSource: {
        synchronizationStatus: SynchronizationStatus.fetched,
        payload: {
            modelDefinition: testModelDefinition,
            source: REPOSITORY_LOCATION_TYPE.Public,
            isModelValid: true
        },
    },
    digitalTwin: {
        payload: testDigitalTwin,
        synchronizationStatus: SynchronizationStatus.fetched
    }
}
