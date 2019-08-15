/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { call, put, select } from 'redux-saga/effects';
import { Action } from 'typescript-fsa';
import { fetchModelDefinition } from '../../../api/services/digitalTwinsModelService';
import { addNotificationAction } from '../../../notifications/actions';
import { NotificationType } from '../../../api/models/notification';
import { ResourceKeys } from '../../../../localization/resourceKeys';
import { getModelDefinitionAction, GetModelDefinitionActionParameters } from '../actions';
import { FetchModelParameters } from '../../../api/parameters/repoParameters';
import { getRepoTokenSaga } from '../../../settings/sagas/getRepoTokenSaga';
import { getRepositoryLocationSettingsSelector, getPublicRepositoryHostName } from '../../../settings/selectors';
import { RepositoryLocationSettings } from '../../../settings/state';
import { REPOSITORY_LOCATION_TYPE } from './../../../constants/repositoryLocationTypes';
import { getRepoConnectionInfoFromConnectionString } from '../../../api/shared/utils';
import { invokeDigitalTwinInterfaceCommand } from '../../../api/services/devicesService';
import { getConnectionStringSelector } from '../../../login/selectors';
import { getDigitalTwinInterfaceIdsSelector } from '../selectors';
import { InterfaceNotImplementedException } from './../../../shared/utils/exceptions/interfaceNotImplementedException';
import { modelDefinitionInterfaceId, modelDefinitionInterfaceName, modelDefinitionCommandName } from '../../../constants/modelDefinitionConstants';

export function* getModelDefinitionSaga(action: Action<GetModelDefinitionActionParameters>) {
    try {

        const locations: RepositoryLocationSettings[] = yield select(getRepositoryLocationSettingsSelector);
        let errorCount = 0;
        for (const location of locations) { // try to get model definition in order according to user's location settings
            try {
                const modelDefinition = yield call (getModelDefinition, action, location);
                yield put(getModelDefinitionAction.done(
                    {params: action.payload, result: {modelDefinition, source: location.repositoryLocationType}}));
                break; // found the model definition, break
            }
            catch {
                errorCount ++;
                // continue the loop
            }
        }
        if (errorCount === locations.length) {
            yield put(addNotificationAction.started({
                text: {
                    translationKey: ResourceKeys.notifications.getInterfaceModelOnError,
                    translationOptions: {
                        interfaceId: action.payload.interfaceId
                    },
                },
                type: NotificationType.error
            }));
            yield put(getModelDefinitionAction.failed({params: action.payload, error: undefined}));
        }

    } catch (error) {
        yield put(addNotificationAction.started({
            text: {
                translationKey: ResourceKeys.notifications.getInterfaceModelOnError,
                translationOptions: {
                    interfaceId: action.payload
                },
            },
            type: NotificationType.error
        }));

        yield put(getModelDefinitionAction.failed({params: action.payload, error}));
    }
}

function *getModelDefinitionFromPrivateRepo(action: Action<GetModelDefinitionActionParameters>, location: RepositoryLocationSettings) {
    const repoConnectionStringInfo = getRepoConnectionInfoFromConnectionString(location.connectionString);
    const parameters: FetchModelParameters = {
        id: action.payload.interfaceId,
        repoServiceHostName: repoConnectionStringInfo.hostName,
        repositoryId: repoConnectionStringInfo.repositoryId,
        token: yield call(getRepoTokenSaga, location.repositoryLocationType)
    };
    return yield call(fetchModelDefinition, parameters);
}

function *getModelDefinitionFromPublicRepo(action: Action<GetModelDefinitionActionParameters>, location: RepositoryLocationSettings) {
    const parameters: FetchModelParameters = {
        id: action.payload.interfaceId,
        repoServiceHostName: yield select(getPublicRepositoryHostName),
        token: yield call(getRepoTokenSaga, location.repositoryLocationType)
    };
    return yield call(fetchModelDefinition, parameters);
}

function *getModelDefinitionFromDevice(action: Action<GetModelDefinitionActionParameters>) {
    const interfaceIds: string[] = yield select(getDigitalTwinInterfaceIdsSelector);
    if (interfaceIds.filter(id => id === modelDefinitionInterfaceId).length === 0) {
        throw new InterfaceNotImplementedException();
    }
    return yield call(invokeDigitalTwinInterfaceCommand, {
        commandName: modelDefinitionCommandName,
        connectionString: yield select(getConnectionStringSelector),
        digitalTwinId: action.payload.digitalTwinId,
        interfaceName: modelDefinitionInterfaceName,
        payload: action.payload.interfaceId
    });
}

function *getModelDefinition(action: Action<GetModelDefinitionActionParameters>, location: RepositoryLocationSettings) {
    if (location.repositoryLocationType === REPOSITORY_LOCATION_TYPE.Private) {
        return yield call(getModelDefinitionFromPrivateRepo, action, location);
    }
    if (location.repositoryLocationType === REPOSITORY_LOCATION_TYPE.Public) {
        return yield call(getModelDefinitionFromPublicRepo, action, location);
    }
    if (location.repositoryLocationType === REPOSITORY_LOCATION_TYPE.Device) {
        return yield call(getModelDefinitionFromDevice, action);
    }
}
