/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import 'jest';
import { Record } from 'immutable';
import { Twin } from '../../api/models/device';
import { GET_TWIN,
    CLEAR_MODEL_DEFINITIONS,
    GET_DEVICE_IDENTITY,
    FETCH_MODEL_DEFINITION,
    GET_DIGITAL_TWIN_INTERFACE_PROPERTIES,
    PATCH_DIGITAL_TWIN_INTERFACE_PROPERTIES,
    UPDATE_DEVICE_IDENTITY
  } from '../../constants/actionTypes';
import { getTwinAction,
    getModelDefinitionAction,
    clearModelDefinitionsAction,
    getDeviceIdentityAction,
    getDigitalTwinInterfacePropertiesAction,
    patchDigitalTwinInterfacePropertiesAction,
    updateDeviceIdentityAction,
    setInterfaceIdAction } from './actions';
import reducer from './reducer';
import { deviceContentStateInitial, DeviceContentStateInterface } from './state';
import { ModelDefinition } from '../../api/models/ModelDefinition';
import { DeviceIdentity } from '../../api/models/deviceIdentity';
import { SynchronizationStatus } from '../../api/models/synchronizationStatus';
import { DigitalTwinInterfaces } from '../../api/models/digitalTwinModels';
import { REPOSITORY_LOCATION_TYPE } from '../../constants/repositoryLocationTypes';
import { SET_INTERFACE_ID } from './../../constants/actionTypes';

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
            modelDefinition,
            modelDefinitionSynchronizationStatus: SynchronizationStatus.fetched,
            source: REPOSITORY_LOCATION_TYPE.Public
        };

        it (`handles ${FETCH_MODEL_DEFINITION}/ACTION_START action`, () => {
            const action = getModelDefinitionAction.started({digitalTwinId: 'testDevice', interfaceId: 'urn:azureiot:ModelDiscovery:ModelInformation:1'});
            expect(reducer(deviceContentStateInitial(), action).modelDefinitionWithSource.modelDefinitionSynchronizationStatus).toEqual(SynchronizationStatus.working);
        });

        it (`handles ${FETCH_MODEL_DEFINITION}/ACTION_DONE action`, () => {
            const action = getModelDefinitionAction.done({params: {digitalTwinId: 'testDevice', interfaceId: 'urn:azureiot:ModelDiscovery:ModelInformation:1'}, result: {modelDefinition, source: REPOSITORY_LOCATION_TYPE.Public }});
            expect(reducer(deviceContentStateInitial(), action).modelDefinitionWithSource).toEqual({
                modelDefinition,
                modelDefinitionSynchronizationStatus: SynchronizationStatus.fetched,
                source: REPOSITORY_LOCATION_TYPE.Public
            });
        });

        it (`handles ${FETCH_MODEL_DEFINITION}/ACTION_FAILED action`, () => {
            const action = getModelDefinitionAction.failed({error: -1, params: {digitalTwinId: 'testDevice', interfaceId: 'urn:azureiot:ModelDiscovery:ModelInformation:1'}});
            expect(reducer(deviceContentStateInitial(), action).modelDefinitionWithSource.modelDefinitionSynchronizationStatus).toEqual(SynchronizationStatus.failed);
        });

        it (`handles ${CLEAR_MODEL_DEFINITIONS} action`, () => {
            const initialState = Record<DeviceContentStateInterface>({
                deviceIdentity: undefined,
                deviceTwin: undefined,
                digitalTwinInterfaceProperties: undefined,
                interfaceIdSelected: '',
                modelDefinitionWithSource,
            });
            const action = clearModelDefinitionsAction();
            expect(reducer(initialState(), action).modelDefinitionWithSource).toEqual(null);
        });

        it (`handles ${SET_INTERFACE_ID} action`, () => {
            const action = setInterfaceIdAction('testId');
            expect(reducer(deviceContentStateInitial(), action).interfaceIdSelected).toEqual('testId');
        });
    });

    describe('deviceTwin scenarios', () => {
        /* tslint:disable */
        const result: Twin = {
            deviceId,
            etag: 'AAAAAAAAAAk=',
            deviceEtag: 'NTQ0MTQ4NzAy',
            status: 'enabled',
            lastActivityTime: '0001-01-01T00:00:00',
            statusUpdateTime: '0001-01-01T00:00:00',
            x509Thumbprint: {},
            version: 1,
            capabilities: {
                iotEdge: false
            },
            connectionState: 'Connected',
            cloudToDeviceMessageCount: 0,
            authenticationType: 'sas',
            properties: {
                desired: {
                    'contoso*com^EnvironmentalSensor^1*0*0' : {
                        brightlevel: 1
                    }
                },
                reported: {}
            }
        };
        /* tslint:enable */

        it (`handles ${GET_TWIN}/ACTION_START action`, () => {
            const action = getTwinAction.started(deviceId);
            expect(reducer(deviceContentStateInitial(), action).deviceTwin.deviceTwinSynchronizationStatus).toEqual(SynchronizationStatus.working);
        });

        it (`handles ${GET_TWIN}/ACTION_DONE action`, () => {
            const action = getTwinAction.done({params: deviceId, result});
            expect(reducer(deviceContentStateInitial(), action).deviceTwin.deviceTwin).toEqual(result);
        });

        it (`handles ${GET_TWIN}/ACTION_FAILED action`, () => {
            const action = getTwinAction.failed({error: -1, params: deviceId});
            expect(reducer(deviceContentStateInitial(), action).deviceTwin.deviceTwinSynchronizationStatus).toEqual(SynchronizationStatus.failed);
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
                    primaryKey: 'f0wK7Pzk8aFLIRQRpoP9qSKPg6jI5xqXf93gH3cnNp4=',
                    secondaryKey: 'e3DUjGr3PlzN/OWl8YbPtRDO2mT6RBySaTfB1uyu/Dk='
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
            expect(reducer(deviceContentStateInitial(), action).deviceIdentity.deviceIdentitySynchronizationStatus).toEqual(SynchronizationStatus.working);
        });

        it (`handles ${GET_DEVICE_IDENTITY}/ACTION_DONE action`, () => {
            const action = getDeviceIdentityAction.done({params: deviceId, result: deviceIdentity});
            expect(reducer(deviceContentStateInitial(), action).deviceIdentity).toEqual({
                deviceIdentity,
                deviceIdentitySynchronizationStatus: SynchronizationStatus.fetched});
        });

        it (`handles ${GET_DEVICE_IDENTITY}/ACTION_FAILED action`, () => {
            const action = getDeviceIdentityAction.failed({error: -1, params: deviceId});
            expect(reducer(deviceContentStateInitial(), action).deviceIdentity.deviceIdentitySynchronizationStatus).toEqual(SynchronizationStatus.failed);
        });

        let initialState = deviceContentStateInitial();
        initialState = initialState.merge({
            deviceIdentity: {
                deviceIdentity,
                deviceIdentitySynchronizationStatus: SynchronizationStatus.fetched
            }
        });
        deviceIdentity.cloudToDeviceMessageCount = 1;

        it (`handles ${UPDATE_DEVICE_IDENTITY}/ACTION_START action`, () => {
            const action = updateDeviceIdentityAction.started(deviceIdentity);
            expect(reducer(initialState, action).deviceIdentity.deviceIdentitySynchronizationStatus).toEqual(SynchronizationStatus.updating);
        });

        it (`handles ${UPDATE_DEVICE_IDENTITY}/ACTION_DONE action`, () => {
            const action = updateDeviceIdentityAction.done({params: deviceIdentity, result: deviceIdentity});
            expect(reducer(initialState, action).deviceIdentity).toEqual({
                deviceIdentity,
                deviceIdentitySynchronizationStatus: SynchronizationStatus.upserted});
        });

        it (`handles ${UPDATE_DEVICE_IDENTITY}/ACTION_FAILED action`, () => {
            const action = updateDeviceIdentityAction.failed({error: -1, params: deviceIdentity});
            expect(reducer(initialState, action).deviceIdentity.deviceIdentitySynchronizationStatus).toEqual(SynchronizationStatus.failed);
        });
    });

    describe('digitalTwin scenarios', () => {
        /* tslint:disable */
        const digitalTwinInterfaceProperties: DigitalTwinInterfaces = {
            "interfaces": {
                "urn_azureiot_ModelDiscovery_DigitalTwin": {
                "name": "urn_azureiot_ModelDiscovery_DigitalTwin",
                "properties": {
                    "modelInformation": {
                        "reported": {
                            "value": {
                                "modelId": "urn:contoso:cm:1",
                                "interfaces": {
                                    "environmentalsensor": "urn:contoso:environmentalsensor:1",
                                    "urn_azureiot_ModelDiscovery_ModelInformation": "urn:azureiot:ModelDiscovery:ModelInformation:1",
                                    "urn_azureiot_ModelDiscovery_DigitalTwin": "urn:azureiot:ModelDiscovery:DigitalTwin:1"
                                }
                            }
                        }
                    }
                }
            },
            "environmentalsensor": {
                "name": "environmentalsensor",
                "properties": {
                    "myProperty": {
                    "desired": {
                        "value": "Mexico"
                    }
                    },
                "myProperty1": {
                    "desired": {
                        "value": "Lindo"
                    }
                },
                "myProperty2": {
                    "desired": {
                        "value": "Y Querido"
                    }
                }
                }
            }
            },
            "version": 2
        };
        /* tslint:enable */

        it (`handles ${GET_DIGITAL_TWIN_INTERFACE_PROPERTIES}/ACTION_START action`, () => {
            const action = getDigitalTwinInterfacePropertiesAction.started(deviceId);
            expect(reducer(deviceContentStateInitial(), action).digitalTwinInterfaceProperties.digitalTwinInterfacePropertiesSyncStatus).toEqual(SynchronizationStatus.working);
        });

        it (`handles ${GET_DIGITAL_TWIN_INTERFACE_PROPERTIES}/ACTION_DONE action`, () => {
            const action = getDigitalTwinInterfacePropertiesAction.done({params: deviceId, result: digitalTwinInterfaceProperties});
            expect(reducer(deviceContentStateInitial(), action).digitalTwinInterfaceProperties.digitalTwinInterfaceProperties).toEqual(digitalTwinInterfaceProperties);
        });

        it (`handles ${GET_DIGITAL_TWIN_INTERFACE_PROPERTIES}/ACTION_FAILED action`, () => {
            const action = getDigitalTwinInterfacePropertiesAction.failed({error: -1, params: deviceId});
            expect(reducer(deviceContentStateInitial(), action).digitalTwinInterfaceProperties.digitalTwinInterfacePropertiesSyncStatus).toEqual(SynchronizationStatus.failed);
        });

        let initialState = deviceContentStateInitial();
        initialState = initialState.merge({
            digitalTwinInterfaceProperties: {
                digitalTwinInterfaceProperties,
                digitalTwinInterfacePropertiesSyncStatus: SynchronizationStatus.fetched
            }
        });
        digitalTwinInterfaceProperties.version = 1;

        it (`handles ${PATCH_DIGITAL_TWIN_INTERFACE_PROPERTIES}/ACTION_START action`, () => {
            const action = patchDigitalTwinInterfacePropertiesAction.started({
                digitalTwinId: deviceId,
                interfacesPatchData: 'Mexico',
                propertyKey: 'myProperty'
            });
            expect(reducer(initialState, action).digitalTwinInterfaceProperties.digitalTwinInterfacePropertiesSyncStatus).toEqual(SynchronizationStatus.updating);
        });

        it (`handles ${PATCH_DIGITAL_TWIN_INTERFACE_PROPERTIES}/ACTION_DONE action`, () => {
            const action = patchDigitalTwinInterfacePropertiesAction.done({params: {
                digitalTwinId: deviceId,
                interfacesPatchData: 'Mexico',
                propertyKey: 'myProperty'
            }, result: digitalTwinInterfaceProperties});
            expect(reducer(initialState, action).digitalTwinInterfaceProperties.digitalTwinInterfaceProperties).toEqual(digitalTwinInterfaceProperties);
        });

        it (`handles ${PATCH_DIGITAL_TWIN_INTERFACE_PROPERTIES}/ACTION_FAILED action`, () => {
            const action = patchDigitalTwinInterfacePropertiesAction.failed({error: -1, params: {
                digitalTwinId: deviceId,
                interfacesPatchData: 'Mexico',
                propertyKey: 'myProperty'
            }});
            expect(reducer(initialState, action).digitalTwinInterfaceProperties.digitalTwinInterfacePropertiesSyncStatus).toEqual(SynchronizationStatus.failed);
        });
    });
});
