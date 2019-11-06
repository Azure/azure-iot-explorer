/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import 'jest';
import { select, call, put } from 'redux-saga/effects';
import { SagaIteratorClone, cloneableGenerator } from 'redux-saga/utils';
import { getModelDefinitionSaga, getModelDefinition, getModelDefinitionFromPublicRepo, getModelDefinitionFromPrivateRepo, getModelDefinitionFromDevice } from './modelDefinitionSaga';
import * as DevicesService from '../../../api/services/devicesService';
import { addNotificationAction } from '../../../notifications/actions';
import { NotificationType } from '../../../api/models/notification';
import { ResourceKeys } from '../../../../localization/resourceKeys';
import { getModelDefinitionAction, getDigitalTwinInterfacePropertiesAction } from '../actions';
import { getRepositoryLocationSettingsSelector, getPublicRepositoryHostName } from '../../../settings/selectors';
import { REPOSITORY_LOCATION_TYPE } from '../../../constants/repositoryLocationTypes';
import { getDigitalTwinInterfaceIdsSelector } from '../selectors';
import { getRepoTokenSaga } from '../../../settings/sagas/getRepoTokenSaga';
import { getConnectionStringSelector } from '../../../login/selectors';
import { modelDefinitionInterfaceId, modelDefinitionInterfaceName, modelDefinitionCommandName } from '../../../constants/modelDefinitionConstants';
import { fetchModelDefinition } from '../../../api/services/digitalTwinsModelService';
import { PUBLIC_REPO_HOSTNAME } from '../../../constants/shared';

describe('modelDefinitionSaga', () => {
    const digitalTwinId = 'device_id';
    const interfaceId = 'interface_id';
    const params = {
        digitalTwinId,
        interfaceId
    };
    const action = getModelDefinitionAction.started(params);
    const connectionString = 'connection_string';

    describe('getModelDefinitionSaga', () => {
        let getModelDefinitionSagaGenerator: SagaIteratorClone;

        beforeAll(() => {
            getModelDefinitionSagaGenerator = cloneableGenerator(getModelDefinitionSaga)(action);
        });

        it('fetches the model definition', () => {
            expect(getModelDefinitionSagaGenerator.next()).toEqual({
                done: false,
                value: select(getRepositoryLocationSettingsSelector)
            });

            expect(getModelDefinitionSagaGenerator.next([{
                repositoryLocationType: REPOSITORY_LOCATION_TYPE.Public
            }]).value).toEqual(
                call(getModelDefinition, action, { repositoryLocationType: REPOSITORY_LOCATION_TYPE.Public })
            );
        });

        it('puts the successful action', () => {
            const success = getModelDefinitionSagaGenerator.clone();
            expect(success.next()).toEqual({
                done: false,
                value: put((getModelDefinitionAction.done({
                    params,
                    result: {
                        modelDefinition: undefined,
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
                value: put(addNotificationAction.started({
                    text: {
                        translationKey: ResourceKeys.notifications.getInterfaceModelOnError,
                        translationOptions: {
                            interfaceId: params.interfaceId
                        },
                    },
                    type: NotificationType.error,
                }))
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

    describe('getModelDefinitionFromPrivateRepo ', () => {
        const getModelDefinitionFromPrivateRepoGenerator = cloneableGenerator(getModelDefinitionFromPrivateRepo)
            (action, {repositoryLocationType: REPOSITORY_LOCATION_TYPE.Private, connectionString: 'HostName=test.azureiotrepository.com;RepositoryId=123;SharedAccessKeyName=456;SharedAccessKey=789'});

        expect(getModelDefinitionFromPrivateRepoGenerator.next()).toEqual({
            done: false,
            value: call(getRepoTokenSaga, REPOSITORY_LOCATION_TYPE.Private)
        });

        expect(getModelDefinitionFromPrivateRepoGenerator.next('token')).toEqual({
            done: false,
            value: call(fetchModelDefinition, {
                id: params.interfaceId,
                repoServiceHostName: 'test.azureiotrepository.com',
                repositoryId: '123',
                token: 'token'
            })
        });

        expect(getModelDefinitionFromPrivateRepoGenerator.next().done).toEqual(true);
    });

    describe('getModelDefinitionFromPublicRepo ', () => {
        const getModelDefinitionFromPublicRepoGenerator = cloneableGenerator(getModelDefinitionFromPublicRepo)
            (action, {repositoryLocationType: REPOSITORY_LOCATION_TYPE.Public});

        expect(getModelDefinitionFromPublicRepoGenerator.next()).toEqual({
            done: false,
            value: select(getPublicRepositoryHostName)
        });

        expect(getModelDefinitionFromPublicRepoGenerator.next(PUBLIC_REPO_HOSTNAME)).toEqual({
            done: false,
            value: call(getRepoTokenSaga, REPOSITORY_LOCATION_TYPE.Public)
        });

        expect(getModelDefinitionFromPublicRepoGenerator.next('token')).toEqual({
            done: false,
            value: call(fetchModelDefinition, {
                id: params.interfaceId,
                repoServiceHostName: PUBLIC_REPO_HOSTNAME,
                token: 'token'
            })
        });

        expect(getModelDefinitionFromPublicRepoGenerator.next().done).toEqual(true);
    });

    describe('getModelDefinitionFromDevice ', () => {
        const getModelDefinitionFromDeviceGenerator = cloneableGenerator(getModelDefinitionFromDevice)(action);
        const mockFetchDigitalTwinInterfaceProperties = jest.spyOn(DevicesService, 'fetchDigitalTwinInterfaceProperties').mockImplementationOnce(parameters => {
            return null;
        });

        expect(getModelDefinitionFromDeviceGenerator.next()).toEqual({
            done: false,
            value: select(getConnectionStringSelector)
        });

        expect(getModelDefinitionFromDeviceGenerator.next(connectionString)).toEqual({
            done: false,
            value: call(mockFetchDigitalTwinInterfaceProperties, {
                connectionString,
                digitalTwinId
            })
        });

        const response = {};
        expect(getModelDefinitionFromDeviceGenerator.next(response)).toEqual({
            done: false,
            value: put(getDigitalTwinInterfacePropertiesAction.done({
                params: digitalTwinId,
                result: response
            }))
        });

        expect(getModelDefinitionFromDeviceGenerator.next()).toEqual({
            done: false,
            value: select(getDigitalTwinInterfaceIdsSelector)
        });

        expect(getModelDefinitionFromDeviceGenerator.next([modelDefinitionInterfaceId])).toEqual({
            done: false,
            value: select(getConnectionStringSelector)
        });

        expect(getModelDefinitionFromDeviceGenerator.next('connection_string')).toEqual({
            done: false,
            value: call(DevicesService.invokeDigitalTwinInterfaceCommand, {
                commandName: modelDefinitionCommandName,
                connectionString: 'connection_string',
                digitalTwinId,
                interfaceName: modelDefinitionInterfaceName,
                payload: interfaceId
            })
        });

        expect(getModelDefinitionFromDeviceGenerator.next().done).toEqual(true);
    });

    describe('getModelDefinition', () => {
        it('getModelDefinition from public repo', () => {
            const getModelDefinitionFromPublicRepoGenerator = cloneableGenerator(getModelDefinition)(action, {repositoryLocationType: REPOSITORY_LOCATION_TYPE.Public});
            expect(getModelDefinitionFromPublicRepoGenerator.next()).toEqual({
                done: false,
                value: call(getModelDefinitionFromPublicRepo, action, {repositoryLocationType: REPOSITORY_LOCATION_TYPE.Public})
            });
            expect(getModelDefinitionFromPublicRepoGenerator.next().done).toEqual(true);
        });

        it('getModelDefinition from private repo', () => {
            const getModelDefinitionFromPrivateRepoGenerator = cloneableGenerator(getModelDefinition)(action,  {repositoryLocationType: REPOSITORY_LOCATION_TYPE.Private});
            expect(getModelDefinitionFromPrivateRepoGenerator.next()).toEqual({
                done: false,
                value: call(getModelDefinitionFromPrivateRepo, action, {repositoryLocationType: REPOSITORY_LOCATION_TYPE.Private})
            });
            expect(getModelDefinitionFromPrivateRepoGenerator.next().done).toEqual(true);
        });

        it('getModelDefinition from device', () => {
            const getModelDefinitionFromDeviceGenerator = cloneableGenerator(getModelDefinition)(action,  {repositoryLocationType: REPOSITORY_LOCATION_TYPE.Device});
            expect(getModelDefinitionFromDeviceGenerator.next()).toEqual({
                done: false,
                value: call(getModelDefinitionFromDevice, action)
            });
            expect(getModelDefinitionFromDeviceGenerator.next().done).toEqual(true);
        });
    });
});
