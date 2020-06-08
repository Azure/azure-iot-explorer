/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { ModelDefinition } from '../../../../../api/models/modelDefinition';
import { PnpStateInterface, pnpStateInitial } from '../../state';
import { SynchronizationStatus } from '../../../../../api/models/synchronizationStatus';
import { REPOSITORY_LOCATION_TYPE } from '../../../../../constants/repositoryLocationTypes';

const interfaceId = 'urn:azureiot:samplemodel:1';
export const testComponentName = 'environmentalSensor';
/* tslint:disable */
export const testModelDefinition: ModelDefinition = {
    "@id": interfaceId,
    "@type": "Interface",
    "displayName": "Digital Twin",
    "contents": [
        {
            "@type": "Telemetry",
            "name": "humid",
            "displayName": "Temperature",
            "description": "Current temperature on the device",
            "schema": "double"
        },
    ],
    "@context": "http://azureiot.com/v1/contexts/Interface.json"
}
/* tslint:enable */
