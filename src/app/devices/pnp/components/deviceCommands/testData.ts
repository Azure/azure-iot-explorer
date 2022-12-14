/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { ModelDefinition } from '../../../../api/models/modelDefinition';
import { PnpStateInterface, pnpStateInitial } from '../../state';
import { SynchronizationStatus } from '../../../../api/models/synchronizationStatus';
import { REPOSITORY_LOCATION_TYPE } from '../../../../constants/repositoryLocationTypes';

const interfaceId = 'urn:contoso:com:environmentalsensor;1';
/* tslint:disable */
export const testModelDefinition: ModelDefinition = {
    "@id": interfaceId,
    "@type": "Interface",
    "displayName": "Digital Twin",
    "contents": [
        {
            "@type": "Command",
            "description": "This command will begin blinking the LED for given time interval.",
            "name": "blink",
            "request": {
                "name": "blinkRequest",
                "schema": "long"
            },
            "response": {
                "name": "blinkResponse",
                "schema": "string"
            },
            "commandType": "synchronous"
        }
    ],
    "@context": "https://azureiot.com/v1/contexts/Interface.json"
};

export const pnpStateWithTestData: PnpStateInterface = {
    ...pnpStateInitial(),
    modelDefinitionWithSource: {
        synchronizationStatus: SynchronizationStatus.fetched,
        payload: {
            isModelValid: true,
            modelDefinition: testModelDefinition,
            source: REPOSITORY_LOCATION_TYPE.Public
        }
    }
}