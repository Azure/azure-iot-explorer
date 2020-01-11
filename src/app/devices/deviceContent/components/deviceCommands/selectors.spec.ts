/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import 'jest';
import { Record } from 'immutable';
import { ModelDefinition } from '../../../../api/models/modelDefinition';
import { SynchronizationStatus } from '../../../../api/models/synchronizationStatus';
import { getDeviceCommandPairs } from './selectors';
import { getInitialState } from '../../../../api/shared/testHelper';

describe('getDeviceCommandPairs', () => {
    it('returns interface commands', () => {
        const state = getInitialState();
        const interfaceId = 'urn:contoso:com:environmentalsensor:1';
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
                                        "environmentalsensor": interfaceId,
                                        "urn_azureiot_ModelDiscovery_ModelInformation": "urn:azureiot:ModelDiscovery:ModelInformation:1",
                                        "urn_azureiot_ModelDiscovery_DigitalTwin": "urn:azureiot:ModelDiscovery:DigitalTwin:1"
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
            "@context": "http://azureiot.com/v1/contexts/Interface.json"
        }
        /* tslint:enable */

        state.deviceContentState = Record({
            deviceIdentity: null,
            deviceTwin: null,
            digitalTwinInterfaceProperties: {
                payload: digitalTwinInterfaceProperties,
                synchronizationStatus: SynchronizationStatus.fetched
            },
            interfaceIdSelected: interfaceId,
            modelDefinitionWithSource: {
                payload: modelDefinition,
                source: null,
                synchronizationStatus: SynchronizationStatus.fetched,
            }
        })();

        const commandSchemas = [
            {
                commandModelDefinition: {
                    '@type': 'Command',
                    'commandType': 'synchronous',
                    'description': 'This command will begin blinking the LED for given time interval.',
                    'name': 'blink',
                    'request': {
                        name: 'blinkRequest',
                        schema: 'long'
                    },
                    'response': {
                        name: 'blinkResponse',
                        schema: 'string'
                    }
                },
                parsedSchema: {
                    description: 'This command will begin blinking the LED for given time interval.',
                    name: 'blink',
                    requestSchema: {
                        description: '',
                        title: 'blinkRequest',
                        type: 'number'
                    },
                    responseSchema: {
                        description: '',
                        title: 'blinkResponse',
                        type: 'string'
                    }
                }
            }
        ];
        expect(getDeviceCommandPairs(state))
            .toEqual({commandSchemas, interfaceName: 'environmentalsensor'});
    });
});
