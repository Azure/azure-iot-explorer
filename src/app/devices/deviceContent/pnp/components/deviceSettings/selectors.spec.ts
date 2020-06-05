
// /***********************************************************
//  * Copyright (c) Microsoft Corporation. All rights reserved.
//  * Licensed under the MIT License
//  **********************************************************/
// import 'jest';
// import { Record } from 'immutable';
// import { ModelDefinition } from '../../../../../api/models/modelDefinition';
// import { SynchronizationStatus } from '../../../../../api/models/synchronizationStatus';
// import { getDeviceSettingTupleSelector } from './selectors';
// import { getInitialState } from '../../../../../api/shared/testHelper';
// import { REPOSITORY_LOCATION_TYPE } from '../../../../../constants/repositoryLocationTypes';

// describe('getDigitalTwinSettingsSelector', () => {
//     const state = getInitialState();
//     const interfaceId = 'urn:azureiot:samplemodel:1';
//     const componentName = 'environmentalSensor';
//     /* tslint:disable */
//     const digitalTwin = {
//         "$dtId": "testDevice",
//         "$metadata": {
//             "$model": interfaceId
//         }
//     };
//     digitalTwin[componentName] = {
//         "brightness": 123,
//         "$metadata": {
//             "brightness": {
//                 "desiredValue": 456,
//                 "desiredVersion": 2,
//                 "lastUpdateTime": "2020-03-31T23:17:42.4813073Z"
//             }
//         }
//     };

//     const brightnessProperty = {
//         '@type': 'Property',
//         displayName: 'Brightness Level',
//         description: 'The brightness level for the light on the device. Can be specified as 1 (high), 2 (medium), 3 (low)',
//         name: 'brightness',
//         writable: true,
//         schema: 'long'
//     };
//     const sampleSenmanticProperty = {
//         '@type': [
//             "Property",
//             "SemanticType/Brightness Level"
//           ],
//         displayName: 'Brightness Level',
//         description: 'The brightness level for the light on the device. Can be specified as 1 (high), 2 (medium), 3 (low)',
//         name: 'brightness',
//         writable: true,
//         schema: 'long'
//     };
//     const modelDefinition: ModelDefinition = {
//         '@id': interfaceId,
//         '@type': 'Interface',
//         '@context': 'http://azureiot.com/v1/contexts/Interface.json',
//         displayName: 'Environmental Sensor',
//         description: 'Provides functionality to report temperature, humidity. Provides telemetry, commands and read-write properties',
//         comment: 'Requires temperature and humidity sensors.',
//         contents: [ brightnessProperty, sampleSenmanticProperty ]
//     }
//     /* tslint:enable */

//     state.deviceContentState = Record({
//         componentNameSelected: componentName,
//         deviceIdentity: null,
//         deviceTwin: null,
//         digitalTwin: {
//             payload:  digitalTwin,
//             synchronizationStatus: SynchronizationStatus.fetched,
//         },
//         modelDefinitionWithSource: {
//             payload: {
//                 isModelValid: true,
//                 modelDefinition,
//                 source: REPOSITORY_LOCATION_TYPE.Private
//             },
//             synchronizationStatus: SynchronizationStatus.fetched,
//         }
//     })();

//     it('returns interface settings tuple', () => {
//         expect(getDeviceSettingTupleSelector(state).interfaceId).toEqual(interfaceId);
//         expect(getDeviceSettingTupleSelector(state).componentName).toEqual(componentName);
//         expect(getDeviceSettingTupleSelector(state).twinWithSchema[0]).toEqual({
//             isComponentContainedInDigitalTwin: true,
//             metadata: {
//                 desiredValue: 456,
//                 desiredVersion: 2,
//                 lastUpdateTime: '2020-03-31T23:17:42.4813073Z'
//             },
//             reportedTwin: 123,
//             settingModelDefinition: modelDefinition.contents[0],
//             settingSchema: {
//                 definitions: {},
//                 required: [],
//                 title: modelDefinition.contents[0].name,
//                 type: ['number', 'null']
//             }
//         });
//     });
// });
