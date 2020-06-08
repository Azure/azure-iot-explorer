/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import 'jest';
import {
    FETCH_MODEL_DEFINITION,
    PATCH_DIGITAL_TWIN,
    GET_DIGITAL_TWIN
  } from '../../../constants/actionTypes';
import {
    getModelDefinitionAction,
    patchDigitalTwinAction,
    getDigitalTwinAction,
    GetModelDefinitionActionParameters,
    PatchDigitalTwinActionParameters
} from './actions';
import { pnpReducer } from './reducer';
import { pnpStateInitial  } from './state';
import { ModelDefinition } from '../../../api/models/ModelDefinition';
import { SynchronizationStatus } from '../../../api/models/synchronizationStatus';
import { REPOSITORY_LOCATION_TYPE } from '../../../constants/repositoryLocationTypes';

describe('pnpReducer', () => {
    const deviceId = 'testDeviceId';

    describe('interface scenarios', () => {
        /* tslint:disable */
        const modelDefinition: ModelDefinition = {
            "@id": "urn:azureiot:ModelDiscovery:ModelInformation:1",
            "@type": "Interface",
            "displayName": "Model Information",
            "contents": [
            {
                "@type": "Telemetry",
                "name": "modelInformation",
                "displayName": "Model Information ",
                "description": "Ids for the capability model and interfaces implemented on the device.",
                "schema": {
                    "@type": "Object",
                    "fields": [
                        {
                            "name": "capabilityModelId",
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
            }],
            "@context": "http://azureiot.com/v1/contexts/Interface.json"
        }
        /* tslint:enable */
        const modelDefinitionWithSource = {
            payload: {
                isModelValid: true,
                modelDefinition,
                source: REPOSITORY_LOCATION_TYPE.Public
            },
            synchronizationStatus: SynchronizationStatus.fetched,
        };

        const getModelDefinitionActionParams: GetModelDefinitionActionParameters = {
            digitalTwinId: 'testDevice',
            interfaceId: 'urn:azureiot:ModelDiscovery:ModelInformation:1',
            locations: []
        };

        it (`handles ${FETCH_MODEL_DEFINITION}/ACTION_START action`, () => {
            const action = getModelDefinitionAction.started(getModelDefinitionActionParams);
            expect(pnpReducer(pnpStateInitial(), action).modelDefinitionWithSource.synchronizationStatus).toEqual(SynchronizationStatus.working);
        });

        it (`handles ${FETCH_MODEL_DEFINITION}/ACTION_DONE action`, () => {
            const action = getModelDefinitionAction.done(
                {
                    params: getModelDefinitionActionParams,
                    result: {isModelValid: true, modelDefinition, source: REPOSITORY_LOCATION_TYPE.Public }
                });
            expect(pnpReducer(pnpStateInitial(), action).modelDefinitionWithSource).toEqual({
                payload: {
                    isModelValid: true,
                    modelDefinition,
                    source: REPOSITORY_LOCATION_TYPE.Public
                },
                synchronizationStatus: SynchronizationStatus.fetched
            });
        });

        it (`handles ${FETCH_MODEL_DEFINITION}/ACTION_FAILED action`, () => {
            const action = getModelDefinitionAction.failed({error: -1, params: getModelDefinitionActionParams});
            expect(pnpReducer(pnpStateInitial(), action).modelDefinitionWithSource.synchronizationStatus).toEqual(SynchronizationStatus.failed);
        });
    });

    describe('digitalTwin scenarios', () => {

        /* tslint:disable */
        const digitalTwin = {
            "$dtId": "testDevice",
            "environmentalSensor": {
              "state": true,
              "$metadata": {
                "state": {
                  "lastUpdateTime": "2020-03-31T23:17:42.4813073Z"
                }
              }
            },
            "$metadata": {
              "$model": "urn:azureiot:samplemodel:1"
            }
        };
        /* tslint:enable */

        it (`handles ${GET_DIGITAL_TWIN}/ACTION_START action`, () => {
            const action = getDigitalTwinAction.started(deviceId);
            expect(pnpReducer(pnpStateInitial(), action).digitalTwin.synchronizationStatus).toEqual(SynchronizationStatus.working);
        });

        it (`handles ${GET_DIGITAL_TWIN}/ACTION_DONE action`, () => {
            const action = getDigitalTwinAction.done({params: deviceId, result: digitalTwin});
            expect(pnpReducer(pnpStateInitial(), action).digitalTwin.payload).toEqual(digitalTwin);
        });

        it (`handles ${GET_DIGITAL_TWIN}/ACTION_FAILED action`, () => {
            const action = getDigitalTwinAction.failed({error: -1, params: deviceId});
            expect(pnpReducer(pnpStateInitial(), action).digitalTwin.synchronizationStatus).toEqual(SynchronizationStatus.failed);
        });

        let initialState = pnpStateInitial();
        initialState = initialState.merge({
            digitalTwin: {
                payload: digitalTwin,
                synchronizationStatus: SynchronizationStatus.fetched
            }
        });
        digitalTwin.environmentalSensor.state = false;
        const parameters: PatchDigitalTwinActionParameters =  {
            digitalTwinId: deviceId,
            payload: []
        };

        it (`handles ${PATCH_DIGITAL_TWIN}/ACTION_START action`, () => {
            const action = patchDigitalTwinAction.started(parameters);
            expect(pnpReducer(initialState, action).digitalTwin.synchronizationStatus).toEqual(SynchronizationStatus.updating);
        });

        it (`handles ${PATCH_DIGITAL_TWIN}/ACTION_DONE action`, () => {
            const action = patchDigitalTwinAction.done({params: parameters, result: digitalTwin});
            expect(pnpReducer(initialState, action).digitalTwin.payload).toEqual(digitalTwin);
        });

        it (`handles ${PATCH_DIGITAL_TWIN}/ACTION_FAILED action`, () => {
            const action = patchDigitalTwinAction.failed({error: -1, params: parameters});
            expect(pnpReducer(initialState, action).digitalTwin.synchronizationStatus).toEqual(SynchronizationStatus.failed);
        });
    });
});
