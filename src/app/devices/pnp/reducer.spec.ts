/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import 'jest';
import {
    FETCH_MODEL_DEFINITION,
    GET_MODULE_IDENTITY_TWIN,
    GET_TWIN,
    UPDATE_MODULE_IDENTITY_TWIN,
    UPDATE_TWIN
  } from '../../constants/actionTypes';
import {
    getModelDefinitionAction,
    getDeviceTwinAction,
    updateDeviceTwinAction,
    GetModelDefinitionActionParameters,
    getModuleTwinAction
} from './actions';
import { pnpReducer } from './reducer';
import { pnpStateInitial  } from './state';
import { ModelDefinition } from '../../api/models/ModelDefinition';
import { SynchronizationStatus } from '../../api/models/synchronizationStatus';
import { REPOSITORY_LOCATION_TYPE } from '../../constants/repositoryLocationTypes';

describe('pnpReducer', () => {
    const deviceId = 'testDeviceId';

    describe('interface scenarios', () => {
        /* tslint:disable */
        const modelDefinition: ModelDefinition = {
            "@id": "urn:azureiot:ModelDiscovery:ModelInformation;1",
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
            "@context": "https://azureiot.com/v1/contexts/Interface.json"
        }
        /* tslint:enable */

        const getModelDefinitionActionParams: GetModelDefinitionActionParameters = {
            digitalTwinId: 'testDevice',
            interfaceId: 'urn:azureiot:ModelDiscovery:ModelInformation;1',
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

    describe('twin scenarios', () => {

        /* tslint:disable */
        const deviceTwin: any = {
            "deviceId": "testDevice",
            "modelId": "urn:azureiot:samplemodel;1",
            "properties" : {
                desired: {
                    environmentalSensor: {
                        state: true,
                        __t: 'c'
                    }
                }
            }
        };
        /* tslint:enable */

        it (`handles ${GET_TWIN}/ACTION_START action`, () => {
            const action = getDeviceTwinAction.started(deviceId);
            expect(pnpReducer(pnpStateInitial(), action).twin.synchronizationStatus).toEqual(SynchronizationStatus.working);
        });

        it (`handles ${GET_TWIN}/ACTION_DONE action`, () => {
            const action = getDeviceTwinAction.done({params: deviceId, result: deviceTwin});
            expect(pnpReducer(pnpStateInitial(), action).twin.payload).toEqual(deviceTwin);
        });

        it (`handles ${GET_TWIN}/ACTION_FAILED action`, () => {
            const action = getDeviceTwinAction.failed({error: -1, params: deviceId});
            expect(pnpReducer(pnpStateInitial(), action).twin.synchronizationStatus).toEqual(SynchronizationStatus.failed);
        });

        let initialState = pnpStateInitial();
        initialState = initialState.merge({
            twin: {
                payload: deviceTwin as any,
                synchronizationStatus: SynchronizationStatus.fetched
            }
        });
        deviceTwin.properties.desired.environmentalSensor.state = false;

        it (`handles ${UPDATE_TWIN}/ACTION_START action`, () => {
            const action = updateDeviceTwinAction.started(deviceTwin);
            expect(pnpReducer(initialState, action).twin.synchronizationStatus).toEqual(SynchronizationStatus.updating);
        });

        it (`handles ${UPDATE_TWIN}/ACTION_DONE action`, () => {
            const action = updateDeviceTwinAction.done({params: deviceTwin, result: deviceTwin});
            expect(pnpReducer(initialState, action).twin.payload).toEqual(deviceTwin);
        });

        it (`handles ${UPDATE_TWIN}/ACTION_FAILED action`, () => {
            const action = updateDeviceTwinAction.failed({error: -1, params: deviceTwin});
            expect(pnpReducer(initialState, action).twin.synchronizationStatus).toEqual(SynchronizationStatus.failed);
        });
    });

    describe('module twin scenarios', () => {

        /* tslint:disable */
        const moduleTwin: any = {
            "deviceId": "testDevice",
            "moduleId": "testModule",
            "modelId": "urn:azureiot:samplemodel;1",
            "properties" : {
                desired: {
                    environmentalSensor: {
                        state: true,
                        __t: 'c'
                    }
                }
            }
        };
        /* tslint:enable */

        it (`handles ${GET_MODULE_IDENTITY_TWIN}/ACTION_START action`, () => {
            const action = getModuleTwinAction.started({deviceId: moduleTwin.deviceId, moduleId: moduleTwin.moduleId});
            expect(pnpReducer(pnpStateInitial(), action).twin.synchronizationStatus).toEqual(SynchronizationStatus.working);
        });

        it (`handles ${GET_MODULE_IDENTITY_TWIN}/ACTION_DONE action`, () => {
            const action = getModuleTwinAction.done({params: {deviceId: moduleTwin.deviceId, moduleId: moduleTwin.moduleId}, result: moduleTwin});
            expect(pnpReducer(pnpStateInitial(), action).twin.payload).toEqual(moduleTwin);
        });

        it (`handles ${GET_MODULE_IDENTITY_TWIN}/ACTION_FAILED action`, () => {
            const action = getModuleTwinAction.failed({error: -1, params: {deviceId: moduleTwin.deviceId, moduleId: moduleTwin.moduleId}});
            expect(pnpReducer(pnpStateInitial(), action).twin.synchronizationStatus).toEqual(SynchronizationStatus.failed);
        });

        let initialState = pnpStateInitial();
        initialState = initialState.merge({
            twin: {
                payload: moduleTwin as any,
                synchronizationStatus: SynchronizationStatus.fetched
            }
        });
        moduleTwin.properties.desired.environmentalSensor.state = false;

        it (`handles ${UPDATE_MODULE_IDENTITY_TWIN}/ACTION_START action`, () => {
            const action = updateDeviceTwinAction.started(moduleTwin);
            expect(pnpReducer(initialState, action).twin.synchronizationStatus).toEqual(SynchronizationStatus.updating);
        });

        it (`handles ${UPDATE_MODULE_IDENTITY_TWIN}/ACTION_DONE action`, () => {
            const action = updateDeviceTwinAction.done({params: moduleTwin, result: moduleTwin});
            expect(pnpReducer(initialState, action).twin.payload).toEqual(moduleTwin);
        });

        it (`handles ${UPDATE_MODULE_IDENTITY_TWIN}/ACTION_FAILED action`, () => {
            const action = updateDeviceTwinAction.failed({error: -1, params: moduleTwin});
            expect(pnpReducer(initialState, action).twin.synchronizationStatus).toEqual(SynchronizationStatus.failed);
        });
    });
});
