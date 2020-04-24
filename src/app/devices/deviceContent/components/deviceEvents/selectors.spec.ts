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
            componentNameSelected: 'environmentalsensor',
            deviceIdentity: null,
            deviceTwin: null,
            digitalTwin: null,
            modelDefinitionWithSource: {
                payload: {
                    isModelValid: true,
                    modelDefinition,
                    source: null,
                },
                synchronizationStatus: SynchronizationStatus.fetched,
            }
        })();

        const telemetrySchemas = [
            {
                parsedSchema: {
                    required: null,
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
