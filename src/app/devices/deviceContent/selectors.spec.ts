/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import 'jest';
import { Record } from 'immutable';
import { SynchronizationStatus } from './../../api/models/synchronizationStatus';
import {
    getDigitalTwinModelId,
    getComponentNameSelector,
    getDigitalTwinSynchronizationStatusSelector,
    getModelDefinitionWithSourceWrapperSelector,
    getModelDefinitionWithSourceSelector,
    getComponentNameAndInterfaceIdArraySelector,
    getModelDefinitionSelector,
    getModelDefinitionSyncStatusSelector,
    defaultComponentKey
} from './selectors';
import { getInitialState } from './../../api/shared/testHelper';
import { REPOSITORY_LOCATION_TYPE } from '../../constants/repositoryLocationTypes';
import { DeviceIdentity } from '../../api/models/deviceIdentity';

describe('selector', () => {
    const state = getInitialState();
    /* tslint:disable */
    const deviceIdentity: DeviceIdentity = {
        cloudToDeviceMessageCount: 0,
        deviceId: 'deviceId',
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
    const modelDefinition ={
        "@id": "dtmi:plugnplay:hube2e:cm;1",
        "@type": "Interface",
        "displayName": "IoT Hub E2E Tests",
            "contents": [
                {
                    "@type": "Component",
                    "name": "deviceInformation",
                    "schema": "dtmi:__DeviceManagement:DeviceInformation;1"
                },
                {
                    "@type": "Component",
                    "name": "sdkInfo",
                    "schema": "dtmi:__Client:SDKInformation;1"
                },
                {
                    "@type": "Component",
                    "name": "environmentalSensor",
                    "schema": "dtmi:__Contoso:EnvironmentalSensor;1"
                },
                {
                    "@type": "Property",
                    "name": "property1",
                    "writable": false,
                    "schema": "long"
                }
            ],
            "@context": "dtmi:dtdl:context;2"
        };
    /* tslint:enable */
    state.deviceContentState = Record({
        componentNameSelected: 'environmentalsensor',
        digitalTwin: {
            payload: digitalTwin,
            synchronizationStatus: SynchronizationStatus.fetched
        },
        modelDefinitionWithSource: {
            payload: {
                isModelValid: true,
                modelDefinition,
                source: REPOSITORY_LOCATION_TYPE.Local
            },
            synchronizationStatus: SynchronizationStatus.fetched
        }
    })();

    describe('get model definition related selectors', () => {
        it('returns componentName', () => {
            expect(getComponentNameSelector(state)).toEqual('environmentalsensor');
        });

        it('returns model definition with source wrapper', () => {
            expect(getModelDefinitionWithSourceWrapperSelector(state)).toEqual({
                payload: {
                    isModelValid: true,
                    modelDefinition,
                    source: REPOSITORY_LOCATION_TYPE.Local
                },
                synchronizationStatus: SynchronizationStatus.fetched
            });
        });

        it('returns model definition', () => {
            expect(getModelDefinitionSelector(state)).toEqual(modelDefinition);
        });

        it('returns model definition with source', () => {
            expect(getModelDefinitionWithSourceSelector(state)).toEqual({
                isModelValid: true,
                    modelDefinition,
                    source: REPOSITORY_LOCATION_TYPE.Local
            });
        });

        it('returns model definition sync status', () => {
            expect(getModelDefinitionSyncStatusSelector(state)).toEqual(SynchronizationStatus.fetched);
        });

        it('returns component to interface mapping from model definition', () => {
            expect(getComponentNameAndInterfaceIdArraySelector(state)).toEqual([
                {componentName: defaultComponentKey, interfaceId: 'dtmi:plugnplay:hube2e:cm;1'},
                {componentName: 'deviceInformation', interfaceId: 'dtmi:__DeviceManagement:DeviceInformation;1'},
                {componentName: 'sdkInfo', interfaceId: 'dtmi:__Client:SDKInformation;1'},
                {componentName: 'environmentalSensor', interfaceId: 'dtmi:__Contoso:EnvironmentalSensor;1'}]);
        });
    });

    describe('getDigitalTwinSelectors', () => {
        it('returns digital twin sync status ', () => {
            expect(getDigitalTwinSynchronizationStatusSelector(state)).toEqual(SynchronizationStatus.fetched);
        });

        it('returns digital twin Model Id ', () => {
            expect(getDigitalTwinModelId(state)).toEqual('urn:azureiot:samplemodel:1');
        });
    });
});
