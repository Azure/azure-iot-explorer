/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { call, put, select } from 'redux-saga/effects';
import { Action } from 'typescript-fsa';
import { fetchModelDefinition, validateModelDefinitions } from '../../../api/services/digitalTwinsModelService';
import { addNotificationAction } from '../../../notifications/actions';
import { NotificationType } from '../../../api/models/notification';
import { ResourceKeys } from '../../../../localization/resourceKeys';
import { getModelDefinitionAction, GetModelDefinitionActionParameters, getDigitalTwinInterfacePropertiesAction } from '../actions';
import { FetchModelParameters } from '../../../api/parameters/repoParameters';
import { getRepoTokenSaga } from '../../../settings/sagas/getRepoTokenSaga';
import { getRepositoryLocationSettingsSelector, getPublicRepositoryHostName, getLocalFolderPath } from '../../../settings/selectors';
import { RepositoryLocationSettings } from '../../../settings/state';
import { REPOSITORY_LOCATION_TYPE } from './../../../constants/repositoryLocationTypes';
import { getRepoConnectionInfoFromConnectionString } from '../../../api/shared/utils';
import { invokeDigitalTwinInterfaceCommand, fetchDigitalTwinInterfaceProperties } from '../../../api/services/digitalTwinService';
import { getActiveAzureResourceConnectionStringSaga } from '../../../azureResource/sagas/getActiveAzureResourceConnectionStringSaga';
import { getDigitalTwinInterfaceIdsSelector, getDigitalTwinComponentNameAndIdsSelector } from '../selectors';
import { InterfaceNotImplementedException } from './../../../shared/utils/exceptions/interfaceNotImplementedException';
import { modelDefinitionInterfaceId, modelDefinitionCommandName } from '../../../constants/modelDefinitionConstants';
import { FetchDigitalTwinInterfacePropertiesParameters } from '../../../api/parameters/deviceParameters';
import { fetchLocalFile } from './../../../api/services/localRepoService';
import { ModelDefinition } from './../../../api/models/modelDefinition';
import { ModelDefinitionNotValidJsonError } from './../../../api/models/modelDefinitionNotValidJsonError';

export function* getModelDefinitionSaga(action: Action<GetModelDefinitionActionParameters>) {
    const locations: RepositoryLocationSettings[] = yield select(getRepositoryLocationSettingsSelector);
    let errorCount = 0;
    for (const location of locations) { // try to get model definition in order according to user's location settings
        try {
            const modelDefinition = yield call (getModelDefinition, action, location);
            const isModelValid = yield call(validateModelDefinitionHelper, modelDefinition, location);
            yield put(getModelDefinitionAction.done(
                {
                    params: action.payload,
                    result: {isModelValid, modelDefinition, source: location.repositoryLocationType}
                }));
            break; // found the model definition, break
        }
        catch (error) {
            if (error instanceof ModelDefinitionNotValidJsonError) {
                yield put(addNotificationAction.started({
                    text: {
                        translationKey: ResourceKeys.notifications.parseLocalInterfaceModelOnError,
                        translationOptions: {
                            interfaceId: action.payload.interfaceId
                        },
                    },
                    type: NotificationType.error
                }));
                yield put(getModelDefinitionAction.done(
                    {
                        params: action.payload,
                        result: {isModelValid: false, modelDefinition: null, source: location.repositoryLocationType}
                    }));
                break;
            }
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
}

export function *validateModelDefinitionHelper(modelDefinition: ModelDefinition, location: RepositoryLocationSettings) {
    if (location.repositoryLocationType === REPOSITORY_LOCATION_TYPE.Private || location.repositoryLocationType === REPOSITORY_LOCATION_TYPE.Public) {
        return true;
    }
    try {
        return yield call (validateModelDefinitions, JSON.stringify([modelDefinition]));
    }
    catch {
        return false;
    }
}

export function *getModelDefinitionFromPrivateRepo(action: Action<GetModelDefinitionActionParameters>, location: RepositoryLocationSettings) {
    const repoConnectionStringInfo = getRepoConnectionInfoFromConnectionString(location.value);
    const parameters: FetchModelParameters = {
        id: action.payload.interfaceId,
        repoServiceHostName: repoConnectionStringInfo.hostName,
        repositoryId: repoConnectionStringInfo.repositoryId,
        token: yield call(getRepoTokenSaga, location.repositoryLocationType)
    };
    return yield call(fetchModelDefinition, parameters);
}

export function* getModelDefinitionFromPublicRepo(action: Action<GetModelDefinitionActionParameters>, location: RepositoryLocationSettings) {
    const parameters: FetchModelParameters = {
        id: action.payload.interfaceId,
        repoServiceHostName: yield select(getPublicRepositoryHostName),
        token: yield call(getRepoTokenSaga, location.repositoryLocationType)
    };
    return yield call(fetchModelDefinition, parameters);
}

export function* getModelDefinitionFromLocalFile(action: Action<GetModelDefinitionActionParameters>) {
    const path = (yield select(getLocalFolderPath)).replace(/\/$/, ''); // remove trailing slash
    const fileName = action.payload.interfaceId.replace(/\:/g, ''); // remove ':' from id
    return yield call(fetchLocalFile, `${path}/${fileName}.json`);
}

export function* getModelDefinitionFromDevice(action: Action<GetModelDefinitionActionParameters>) {
    // dispatch getDigitalTwinInterfacePropertiesAction to make sure it is done before selecting interfaces from the store
    try {
        const parameters: FetchDigitalTwinInterfacePropertiesParameters = {
            connectionString: yield call(getActiveAzureResourceConnectionStringSaga),
            digitalTwinId: action.payload.digitalTwinId,
        };

        const digitalTwinInterfaceProperties = yield call(fetchDigitalTwinInterfaceProperties, parameters);

        yield put(getDigitalTwinInterfacePropertiesAction.done({params: action.payload.digitalTwinId, result: digitalTwinInterfaceProperties}));
    } catch (error) {
        yield put(getDigitalTwinInterfacePropertiesAction.failed({params: action.payload.digitalTwinId, error}));
    }

    // then check if device has implemented ${modelDefinitionInterfaceId} interface.
    const interfaceIds: string[] = yield select(getDigitalTwinInterfaceIdsSelector);
    if (interfaceIds.filter(id => id === modelDefinitionInterfaceId).length === 0) {
        throw new InterfaceNotImplementedException();
    }

    // then get the name of ${modelDefinitionInterfaceId} interface.
    const nameAndIdObject = yield select(getDigitalTwinComponentNameAndIdsSelector);
    let componentName;
    Object.keys(nameAndIdObject).forEach(key => {
        if (nameAndIdObject[key] === modelDefinitionInterfaceId)
        {
            componentName = key;
        }
    });

    if (!componentName) {
        throw new InterfaceNotImplementedException();
    }

    // if interface is implemented, invoke command on device
    return yield call(invokeDigitalTwinInterfaceCommand, {
        commandName: modelDefinitionCommandName,
        componentName,
        connectionString: yield call(getActiveAzureResourceConnectionStringSaga),
        digitalTwinId: action.payload.digitalTwinId,
        payload: action.payload.interfaceId
    });
}

export function* getModelDefinition(action: Action<GetModelDefinitionActionParameters>, location: RepositoryLocationSettings) {
    switch (location.repositoryLocationType) {
        case REPOSITORY_LOCATION_TYPE.Private:
            return yield call(getModelDefinitionFromPrivateRepo, action, location);
        case REPOSITORY_LOCATION_TYPE.Device:
            return yield call(getModelDefinitionFromDevice, action);
        case REPOSITORY_LOCATION_TYPE.Local:
            return yield call(getModelDefinitionFromLocalFile, action);
        default:
            return yield call(getModelDefinitionFromPublicRepo, action, location);
    }
}
