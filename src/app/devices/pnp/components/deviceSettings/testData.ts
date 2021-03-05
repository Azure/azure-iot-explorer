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
export const testDigitalTwin: any = {
    "$dtId": "testDevice",
    "brightness": 1234, // root level brightness
    environmentalSensor: {
        "brightness": 123,  // component level brightness
        "$metadata": {
            "brightness": {
                "desiredValue": 456,
                "desiredVersion": 2,
                "lastUpdateTime": "2020-03-31T23:17:42.4813073Z"
            }
        }
    },
    "$metadata": {
        "$model": interfaceId,
        "brightness": {
            "desiredValue": 5678,
            "desiredVersion": 2,
            "lastUpdateTime": "2020-03-31T23:17:42.4813073Z"
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
    '@id': interfaceId,
    '@type': 'Interface',
    '@context': 'http://azureiot.com/v1/contexts/Interface.json',
    displayName: 'Environmental Sensor',
    description: 'Provides functionality to report temperature, humidity. Provides telemetry, commands and read-write properties',
    comment: 'Requires temperature and humidity sensors.',
    contents: [ brightnessProperty, sampleSenmanticProperty ]
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
        payload: testDigitalTwin,
        synchronizationStatus: SynchronizationStatus.fetched
    }
}
