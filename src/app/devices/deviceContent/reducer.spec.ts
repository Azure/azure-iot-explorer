/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import 'jest';
import { Record } from 'immutable';
import {
    CLEAR_MODEL_DEFINITIONS,
    GET_DEVICE_IDENTITY,
    FETCH_MODEL_DEFINITION,
    PATCH_DIGITAL_TWIN,
    UPDATE_DEVICE_IDENTITY,
    SET_COMPONENT_NAME,
    GET_DIGITAL_TWIN
  } from '../../constants/actionTypes';
import {
    getModelDefinitionAction,
    clearModelDefinitionsAction,
    getDeviceIdentityAction,
    patchDigitalTwinAction,
    updateDeviceIdentityAction,
    setComponentNameAction,
    getDigitalTwinAction
} from './actions';
import reducer from './reducer';
import { deviceContentStateInitial, DeviceContentStateInterface } from './state';
import { ModelDefinition } from '../../api/models/ModelDefinition';
import { DeviceIdentity } from '../../api/models/deviceIdentity';
import { SynchronizationStatus } from '../../api/models/synchronizationStatus';
import { REPOSITORY_LOCATION_TYPE } from '../../constants/repositoryLocationTypes';
import { JsonPatchOperation } from '../../api/parameters/deviceParameters';

describe('deviceContentStateReducer', () => {
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

        it (`handles ${FETCH_MODEL_DEFINITION}/ACTION_START action`, () => {
            const action = getModelDefinitionAction.started({digitalTwinId: 'testDevice', interfaceId: 'urn:azureiot:ModelDiscovery:ModelInformation:1'});
            expect(reducer(deviceContentStateInitial(), action).modelDefinitionWithSource.synchronizationStatus).toEqual(SynchronizationStatus.working);
        });

        it (`handles ${FETCH_MODEL_DEFINITION}/ACTION_DONE action`, () => {
            const action = getModelDefinitionAction.done(
                {
                    params: {digitalTwinId: 'testDevice', interfaceId: 'urn:azureiot:ModelDiscovery:ModelInformation:1'},
                    result: {isModelValid: true, modelDefinition, source: REPOSITORY_LOCATION_TYPE.Public }
                });
            expect(reducer(deviceContentStateInitial(), action).modelDefinitionWithSource).toEqual({
                payload: {
                    isModelValid: true,
                    modelDefinition,
                    source: REPOSITORY_LOCATION_TYPE.Public
                },
                synchronizationStatus: SynchronizationStatus.fetched
            });
        });

        it (`handles ${FETCH_MODEL_DEFINITION}/ACTION_FAILED action`, () => {
            const action = getModelDefinitionAction.failed({error: -1, params: {digitalTwinId: 'testDevice', interfaceId: 'urn:azureiot:ModelDiscovery:ModelInformation:1'}});
            expect(reducer(deviceContentStateInitial(), action).modelDefinitionWithSource.synchronizationStatus).toEqual(SynchronizationStatus.failed);
        });

        it (`handles ${CLEAR_MODEL_DEFINITIONS} action`, () => {
            const initialState = Record<DeviceContentStateInterface>({
                componentNameSelected: '',
                deviceIdentity: undefined,
                digitalTwin: undefined,
                modelDefinitionWithSource
            });
            const action = clearModelDefinitionsAction();
            expect(reducer(initialState(), action).modelDefinitionWithSource).toEqual(null);
        });

        it (`handles ${SET_COMPONENT_NAME} action`, () => {
            const action = setComponentNameAction('testId');
            expect(reducer(deviceContentStateInitial(), action).componentNameSelected).toEqual('testId');
        });
    });

    describe('deviceIdentity scenarios', () => {

        /* tslint:disable */
        const deviceIdentity: DeviceIdentity = {
            cloudToDeviceMessageCount: 0,
            deviceId,
            etag: 'AAAAAAAAAAk=',
            status: 'enabled',
            statusReason:null,
            statusUpdatedTime: '0001-01-01T00:00:00',
            lastActivityTime: '2019-04-22T22:49:58.4457783',
            capabilities: {
                iotEdge: false
            },
            authentication:{
                symmetricKey:{
                    primaryKey: null,
                    secondaryKey: null
                },
                x509Thumbprint:{
                primaryThumbprint:null,
                secondaryThumbprint:null},
                type: 'sas'
            },
        };
        /* tslint:enable */

        it (`handles ${GET_DEVICE_IDENTITY}/ACTION_START action`, () => {
            const action = getDeviceIdentityAction.started(deviceId);
            expect(reducer(deviceContentStateInitial(), action).deviceIdentity.synchronizationStatus).toEqual(SynchronizationStatus.working);
        });

        it (`handles ${GET_DEVICE_IDENTITY}/ACTION_DONE action`, () => {
            const action = getDeviceIdentityAction.done({params: deviceId, result: deviceIdentity});
            expect(reducer(deviceContentStateInitial(), action).deviceIdentity).toEqual({
                payload: deviceIdentity,
                synchronizationStatus: SynchronizationStatus.fetched});
        });

        it (`handles ${GET_DEVICE_IDENTITY}/ACTION_FAILED action`, () => {
            const action = getDeviceIdentityAction.failed({error: -1, params: deviceId});
            expect(reducer(deviceContentStateInitial(), action).deviceIdentity.synchronizationStatus).toEqual(SynchronizationStatus.failed);
        });

        let initialState = deviceContentStateInitial();
        initialState = initialState.merge({
            deviceIdentity: {
                payload: deviceIdentity,
                synchronizationStatus: SynchronizationStatus.fetched
            }
        });
        deviceIdentity.cloudToDeviceMessageCount = 1;

        it (`handles ${UPDATE_DEVICE_IDENTITY}/ACTION_START action`, () => {
            const action = updateDeviceIdentityAction.started(deviceIdentity);
            expect(reducer(initialState, action).deviceIdentity.synchronizationStatus).toEqual(SynchronizationStatus.updating);
        });

        it (`handles ${UPDATE_DEVICE_IDENTITY}/ACTION_DONE action`, () => {
            const action = updateDeviceIdentityAction.done({params: deviceIdentity, result: deviceIdentity});
            expect(reducer(initialState, action).deviceIdentity).toEqual({
                payload: deviceIdentity,
                synchronizationStatus: SynchronizationStatus.upserted});
        });

        it (`handles ${UPDATE_DEVICE_IDENTITY}/ACTION_FAILED action`, () => {
            const action = updateDeviceIdentityAction.failed({error: -1, params: deviceIdentity});
            expect(reducer(initialState, action).deviceIdentity.synchronizationStatus).toEqual(SynchronizationStatus.failed);
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
            expect(reducer(deviceContentStateInitial(), action).digitalTwin.synchronizationStatus).toEqual(SynchronizationStatus.working);
        });

        it (`handles ${GET_DIGITAL_TWIN}/ACTION_DONE action`, () => {
            const action = getDigitalTwinAction.done({params: deviceId, result: digitalTwin});
            expect(reducer(deviceContentStateInitial(), action).digitalTwin.payload).toEqual(digitalTwin);
        });

        it (`handles ${GET_DIGITAL_TWIN}/ACTION_FAILED action`, () => {
            const action = getDigitalTwinAction.failed({error: -1, params: deviceId});
            expect(reducer(deviceContentStateInitial(), action).digitalTwin.synchronizationStatus).toEqual(SynchronizationStatus.failed);
        });

        let initialState = deviceContentStateInitial();
        initialState = initialState.merge({
            digitalTwin: {
                payload: digitalTwin,
                synchronizationStatus: SynchronizationStatus.fetched
            }
        });
        digitalTwin.environmentalSensor.state = false;
        const parameters =  {
            digitalTwinId: deviceId,
            operation: JsonPatchOperation.REPLACE,
            path: '/environmentalSensor/state',
            value: false
        };

        it (`handles ${PATCH_DIGITAL_TWIN}/ACTION_START action`, () => {
            const action = patchDigitalTwinAction.started(parameters);
            expect(reducer(initialState, action).digitalTwin.synchronizationStatus).toEqual(SynchronizationStatus.updating);
        });

        it (`handles ${PATCH_DIGITAL_TWIN}/ACTION_DONE action`, () => {
            const action = patchDigitalTwinAction.done({params: parameters, result: digitalTwin});
            expect(reducer(initialState, action).digitalTwin.payload).toEqual(digitalTwin);
        });

        it (`handles ${PATCH_DIGITAL_TWIN}/ACTION_FAILED action`, () => {
            const action = patchDigitalTwinAction.failed({error: -1, params: parameters});
            expect(reducer(initialState, action).digitalTwin.synchronizationStatus).toEqual(SynchronizationStatus.failed);
        });
    });
});
