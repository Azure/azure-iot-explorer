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
export const testTwin: any = {
    "deviceId": "testDevice",
    properties: {
        desired: {
            "brightness": 5678, // root level brightness,
            environmentalSensor: {
                "__t": "c",
                "brightness": 456,  // component level brightness
            }
        },
        reported: {
            "brightness": {
                "value": 1234,
                "ac": 200,
                "ad": "success",
                "av": 2
            },
            environmentalSensor: {
                "__t": "c",
                "brightness": {
                    "value": 123,
                    "ac": 200,
                    "ad": "success",
                    "av": 2
                }
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
        payload: testTwin,
        synchronizationStatus: SynchronizationStatus.fetched
    }
}
