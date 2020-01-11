/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import 'jest';
import { Record } from 'immutable';
import { ModelDefinition } from '../../../../api/models/modelDefinition';
import { SynchronizationStatus } from '../../../../api/models/synchronizationStatus';
import { getDeviceTelemetrySelector } from './selectors';
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
                    "@type": [
                        "Telemetry",
                        "SemanticType/Temperature"
                    ],
                    "description": "Current temperature on the device",
                    "displayName": "Temperature",
                    "name": "temp",
                    "schema": "double",
                    "unit": "Units/Temperature/fahrenheit"
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

        const telemetrySchemas = [
            {
                parsedSchema: {
                    description: 'Temperature / Current temperature on the device ( Unit: Units/Temperature/fahrenheit )',
                    title: 'temp',
                    type: 'number'
                },
                telemetryModelDefinition: {
                    '@type': [
                        'Telemetry',
                        'SemanticType/Temperature'
                    ],
                    'description': 'Current temperature on the device',
                    'displayName': 'Temperature',
                    'name': 'temp',
                    'schema': 'double',
                    'unit': 'Units/Temperature/fahrenheit'
                }
            }
        ];
        expect(getDeviceTelemetrySelector(state))
            .toEqual(telemetrySchemas);
    });
});
