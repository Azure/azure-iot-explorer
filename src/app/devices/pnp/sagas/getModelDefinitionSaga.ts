/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { call, put } from 'redux-saga/effects';
import { Action } from 'typescript-fsa';
import { fetchModelDefinition, validateModelDefinitions } from '../../../api/services/publicDigitalTwinsModelRepoService';
import { raiseNotificationToast } from '../../../notifications/components/notificationToast';
import { NotificationType } from '../../../api/models/notification';
import { ResourceKeys } from '../../../../localization/resourceKeys';
import { FetchModelParameters } from '../../../api/parameters/repoParameters';
import { RepositoryLocationSettings } from '../../../shared/global/state';
import { REPOSITORY_LOCATION_TYPE } from '../../../constants/repositoryLocationTypes';
import { fetchLocalFile } from '../../../api/services/localRepoService';
import { ModelDefinition } from '../../../api/models/modelDefinition';
import { ModelDefinitionNotValidJsonError } from '../../../api/models/modelDefinitionNotValidJsonError';
import { GetModelDefinitionActionParameters, getModelDefinitionAction } from '../actions';

export function* getModelDefinitionSaga(action: Action<GetModelDefinitionActionParameters>) {
    const { locations, interfaceId } = action.payload;
    let errorCount = 0;
    for (const location of locations) { // try to get model definition in order according to user's location settings
        try {
            const modelDefinition = yield call(getModelDefinition, action, location);
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
                yield call(raiseNotificationToast, {
                    text: {
                        translationKey: ResourceKeys.notifications.parseLocalInterfaceModelOnError,
                        translationOptions: {
                            files: error.message,
                            interfaceId
                        },
                    },
                    type: NotificationType.error
                });
            }
            errorCount ++;
            // continue the loop
        }
    }
    if (errorCount === locations.length) {
        yield call(raiseNotificationToast, {
            text: {
                translationKey: ResourceKeys.notifications.getInterfaceModelOnError,
                translationOptions: {
                    interfaceId: action.payload.interfaceId
                },
            },
            type: NotificationType.error
        });

        yield put(getModelDefinitionAction.failed({params: action.payload, error: undefined}));
    }
}

export function* validateModelDefinitionHelper(modelDefinition: ModelDefinition, location: RepositoryLocationSettings) {
    return true; // commenting out validating model until it aligns with local parser
    try {
            if (location.repositoryLocationType === REPOSITORY_LOCATION_TYPE.Public) {
                return true;
            }
            return yield call(validateModelDefinitions, JSON.stringify([modelDefinition]));
        }
        catch {
            return false;
    }
}

export const getSplitInterfaceId = (fullName: string) => {
    // when component definition is inline, interfaceId is compose of parent file name and inline schema id concatenated with a slash
    return fullName.split('/');
};

export const getFlattenedModel = (model: ModelDefinition, splitInterfaceId: string[]) => {
    if (splitInterfaceId.length === 1) {
        return model;
    }
    else {
        // for inline component, the flattened model is defined under contents array's with matching schema @id
        const components = model.contents.filter((content: any) => // tslint:disable-line: no-any
            content['@type'] === 'Component' && typeof content.schema !== 'string' && content.schema['@id'] === splitInterfaceId[1]);
        return components[0];
    }
};

export function* getModelDefinitionFromPublicRepo(action: Action<GetModelDefinitionActionParameters>) {
    const splitInterfaceId = getSplitInterfaceId(action.payload.interfaceId);
    const parameters: FetchModelParameters = {
        id: splitInterfaceId[0],
        token: ''
    };
    const model = yield call(fetchModelDefinition, parameters);
    return getFlattenedModel(model, splitInterfaceId);
}

export function* getModelDefinitionFromLocalFile(action: Action<GetModelDefinitionActionParameters>) {
    const path = (action.payload.localFolderPath || '').replace(/\/$/, ''); // remove trailing slash
    const splitInterfaceId = getSplitInterfaceId(action.payload.interfaceId);
    const model = yield call(fetchLocalFile, path, splitInterfaceId[0]);
    return getFlattenedModel(model, splitInterfaceId);
}

export function* getModelDefinition(action: Action<GetModelDefinitionActionParameters>, location: RepositoryLocationSettings) {
    switch (location.repositoryLocationType) {
        case REPOSITORY_LOCATION_TYPE.Local:
            return yield call(getModelDefinitionFromLocalFile, action);
        default:
            return yield call(getModelDefinitionFromPublicRepo, action);
    }
}
