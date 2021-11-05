/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import 'jest';
import { call, put } from 'redux-saga/effects';
// tslint:disable-next-line: no-implicit-dependencies
import { SagaIteratorClone, cloneableGenerator } from '@redux-saga/testing-utils';
import {
    getModelDefinitionSaga,
    getModelDefinition,
    getModelDefinitionFromPublicRepo,
    getModelDefinitionFromLocalFile,
    validateModelDefinitionHelper,
    getFlattenedModel,
    getModelDefinitionFromConfigurableRepo,
    expandFromExtendedModel
} from './getModelDefinitionSaga';
import { raiseNotificationToast } from '../../../notifications/components/notificationToast';
import { NotificationType } from '../../../api/models/notification';
import { ResourceKeys } from '../../../../localization/resourceKeys';
import { getModelDefinitionAction, GetModelDefinitionActionParameters } from '../actions';
import { REPOSITORY_LOCATION_TYPE } from '../../../constants/repositoryLocationTypes';
import { fetchLocalFile } from '../../../api/services/localRepoService';
import { fetchModelDefinition } from '../../../api/services/publicDigitalTwinsModelRepoService';
import { ModelDefinition } from './../../../api/models/modelDefinition';

describe('modelDefinition sagas', () => {
    describe('modelDefinition saga flow with no inline component', () => {
        const digitalTwinId = 'device_id';
        const interfaceId = 'urn:azureiot:ModelDiscovery:DigitalTwin:1';
        const params: GetModelDefinitionActionParameters = {
            digitalTwinId,
            interfaceId,
            locations: [{ repositoryLocationType: REPOSITORY_LOCATION_TYPE.Public }],
        };
        const action = getModelDefinitionAction.started(params);
        /* tslint:disable */
        const modelDefinition = {
            "@id": "urn:azureiot:ModelDiscovery:DigitalTwin:1",
            "@type": "Interface",
            "contents": [
                {
                    "@type": "Property",
                    "name": "modelInformation",
                    "displayName": "Model Information",
                    "description": "Providing model and optional interfaces information on a digital twin.",
                    "schema": {
                        "@type": "Object",
                        "fields": [
                            {
                                "name": "modelId",
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
                }
            ],
            "@context": "http://azureiot.com/v1/contexts/Interface.json"
        };
        /* tslint:enable */

        describe('getModelDefinitionSaga', () => {
            let getModelDefinitionSagaGenerator: SagaIteratorClone;

            beforeAll(() => {
                getModelDefinitionSagaGenerator = cloneableGenerator(getModelDefinitionSaga)(action);
            });

            it('fetches the model definition', () => {
                expect(getModelDefinitionSagaGenerator.next().value).toEqual(
                    call(getModelDefinition, action, { repositoryLocationType: REPOSITORY_LOCATION_TYPE.Public })
                );

                expect(getModelDefinitionSagaGenerator.next(modelDefinition).value).toEqual(
                    call(validateModelDefinitionHelper, modelDefinition, { repositoryLocationType: REPOSITORY_LOCATION_TYPE.Public })
                );
            });
            it('checks for extends', () => {
                expect(getModelDefinitionSagaGenerator.next(true).value).toEqual(
                    call(expandFromExtendedModel, action, { repositoryLocationType: REPOSITORY_LOCATION_TYPE.Public}, modelDefinition)
                );
            });

            it('puts the successful action', () => {
                const success = getModelDefinitionSagaGenerator.clone();
                expect(success.next()).toEqual({
                    done: false,
                    value: put((getModelDefinitionAction.done({
                        params,
                        result: {
                            isModelValid: true,
                            modelDefinition,
                            source: REPOSITORY_LOCATION_TYPE.Public
                        }
                    })))
                });

                expect(success.next().done).toEqual(true);
            });

            it('fails on error', () => {
                const failure = getModelDefinitionSagaGenerator.clone();

                expect(failure.throw()).toEqual({
                    done: false,
                    value: call(raiseNotificationToast, {
                        text: {
                            translationKey: ResourceKeys.notifications.getInterfaceModelOnError,
                            translationOptions: {
                                interfaceId: params.interfaceId
                            },
                        },
                        type: NotificationType.error,
                    })
                });

                expect(failure.next()).toEqual({
                    done: false,
                    value: put(getModelDefinitionAction.failed({
                        error: undefined,
                        params
                    }))
                });
                expect(failure.next().done).toEqual(true);
            });
        });

        describe('getModelDefinitionFromPublicRepo ', () => {
            const getModelDefinitionFromPublicRepoGenerator = cloneableGenerator(getModelDefinitionFromPublicRepo)(action);

            expect(getModelDefinitionFromPublicRepoGenerator.next([action.payload.interfaceId])).toEqual({
                done: false,
                value: call(fetchModelDefinition, {
                    id: action.payload.interfaceId,
                    token: ''
                })
            });

            expect(getModelDefinitionFromPublicRepoGenerator.next(modelDefinition).done).toEqual(true);
        });

        describe('getModelDefinitionFromLocalFile ', () => {
            const getModelDefinitionFromLocalFolderGenerator = cloneableGenerator(getModelDefinitionFromLocalFile)
                (action);

            expect(getModelDefinitionFromLocalFolderGenerator.next([action.payload.interfaceId])).toEqual({
                done: false,
                value: call(fetchLocalFile, '', action.payload.interfaceId)
            });

            expect(getModelDefinitionFromLocalFolderGenerator.next(modelDefinition).done).toEqual(true);
        });

        describe('getModelDefinition', () => {
            it('getModelDefinition from public repo', () => {
                const getModelDefinitionFromPublicRepoGenerator = cloneableGenerator(getModelDefinition)(action, {repositoryLocationType: REPOSITORY_LOCATION_TYPE.Public});
                expect(getModelDefinitionFromPublicRepoGenerator.next()).toEqual({
                    done: false,
                    value: call(getModelDefinitionFromPublicRepo, action)
                });
                expect(getModelDefinitionFromPublicRepoGenerator.next().done).toEqual(true);
            });

            it('getModelDefinition from local', () => {
                const getModelDefinitionFromDeviceGenerator = cloneableGenerator(getModelDefinition)(action,  {repositoryLocationType: REPOSITORY_LOCATION_TYPE.Local});
                expect(getModelDefinitionFromDeviceGenerator.next()).toEqual({
                    done: false,
                    value: call(getModelDefinitionFromLocalFile, action)
                });
                expect(getModelDefinitionFromDeviceGenerator.next().done).toEqual(true);
            });
        });

        describe('getFlattenedModel ', () => {
            expect(getFlattenedModel(modelDefinition, [interfaceId])).toEqual(modelDefinition);
        });
    });

    describe('modelDefinition saga flow with inline component', () => {
        const digitalTwinId = 'device_id';
        const interfaceId = 'urn:azureiot:ModelDiscovery:DigitalTwin:1';
        const schemaId = 'dtmi:com:rido:inlineTests:inlineComp;2';
        const fullInterfaceId = `${interfaceId}/${schemaId}`;
        const params: GetModelDefinitionActionParameters = {
            digitalTwinId,
            interfaceId: fullInterfaceId,
            locations: [{ repositoryLocationType: REPOSITORY_LOCATION_TYPE.Public }],
        };
        const action = getModelDefinitionAction.started(params);
        /* tslint:disable */
        const modelDefinition: ModelDefinition = {
            "@context": "dtmi:dtdl:context;2",
            "@id": "urn:azureiot:ModelDiscovery:DigitalTwin:1",
            "@type": "Interface",
            "contents": [
              {
                "@id": "dtmi:com:rido:inlineComp;2",
                "@type": "Component",
                "name": "inLineComponent",
                "schema": {
                  "@type": "Interface",
                  "@id": schemaId,
                  "contents": [
                    {
                      "@type" : "Property",
                      "name" : "inlineProp",
                      "schema" : "string"
                    }
                  ]
                }
              }
            ]
          };
        /* tslint:enable */

        describe('getModelDefinitionFromPublicRepo ', () => {
            const getModelDefinitionFromPublicRepoGenerator = cloneableGenerator(getModelDefinitionFromPublicRepo)(action);

            expect(getModelDefinitionFromPublicRepoGenerator.next([interfaceId, schemaId])).toEqual({
                done: false,
                value: call(fetchModelDefinition, {
                    id: interfaceId,
                    token: ''
                })
            });

            expect(getModelDefinitionFromPublicRepoGenerator.next(modelDefinition).done).toEqual(true);
        });

        describe('getModelDefinitionFromLocalFile ', () => {
            const getModelDefinitionFromLocalFolderGenerator = cloneableGenerator(getModelDefinitionFromLocalFile)
                (getModelDefinitionAction.started({
                    digitalTwinId,
                    interfaceId,
                    locations: [{ repositoryLocationType: REPOSITORY_LOCATION_TYPE.Local, value: 'f:' }],
                }));

            expect(getModelDefinitionFromLocalFolderGenerator.next([interfaceId, schemaId])).toEqual({
                done: false,
                value: call(fetchLocalFile, 'f:', interfaceId)
            });

            expect(getModelDefinitionFromLocalFolderGenerator.next(modelDefinition).done).toEqual(true);
        });

        describe('getModelDefinitionFromConfigurableRepo ', () => {
            const getModelDefinitionFromConfigurableRepoGenerator = cloneableGenerator(getModelDefinitionFromConfigurableRepo)
                (getModelDefinitionAction.started({
                    digitalTwinId,
                    interfaceId,
                    locations: [{ repositoryLocationType: REPOSITORY_LOCATION_TYPE.Configurable, value: 'devicemodeltest.azureedge.net' }],
                }));

            expect(getModelDefinitionFromConfigurableRepoGenerator.next([interfaceId, schemaId])).toEqual({
                done: false,
                value: call(fetchModelDefinition, {
                    id: interfaceId,
                    token: '',
                    url: 'devicemodeltest.azureedge.net'
                })
            });

            expect(getModelDefinitionFromConfigurableRepoGenerator.next(modelDefinition).done).toEqual(true);
        });

        describe('getFlattenedModel ', () => {
            expect(getFlattenedModel(modelDefinition, [interfaceId, schemaId])).toEqual(modelDefinition.contents[0]);
        });
    });
});
