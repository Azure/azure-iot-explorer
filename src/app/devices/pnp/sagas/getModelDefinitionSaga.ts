/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { call, CallEffect, put } from 'redux-saga/effects';
import { Action } from 'typescript-fsa';
import { fetchModelDefinition } from '../../../api/services/publicDigitalTwinsModelRepoService';
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
import { ModelIdCasingNotMatchingException } from '../../../shared/utils/exceptions/modelIdCasingNotMatchingException';

export function* getModelDefinitionSaga(action: Action<GetModelDefinitionActionParameters>) {
    const { locations, interfaceId } = action.payload;
    let errorCount = 0;
    for (const location of locations) { // try to get model definition in order according to user's location settings
        try {
            const modelDefinition: ModelDefinition = yield call(getModelDefinition, action, location);
            const isModelValid: boolean = yield call(validateModelDefinitionHelper, modelDefinition, location);
            const extendedModel: ModelDefinition = yield call(expandFromExtendedModel, action, location, modelDefinition);
            yield put(getModelDefinitionAction.done(
                {
                    params: action.payload,
                    result: { isModelValid, modelDefinition, extendedModel, source: location.repositoryLocationType }
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
            errorCount++;
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

        yield put(getModelDefinitionAction.failed({ params: action.payload, error: undefined }));
    }
}

export function* validateModelDefinitionHelper(modelDefinition: ModelDefinition, location: RepositoryLocationSettings) {
    return true; // commenting out validating model until it aligns with local parser
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

export const checkModelIdCasing = (model: ModelDefinition, id: string) => {
    if (model['@id'] !== id) {
        throw new ModelIdCasingNotMatchingException();
    }
};

export function* getModelDefinitionFromPublicRepo(action: Action<GetModelDefinitionActionParameters>) {
    const splitInterfaceId = getSplitInterfaceId(action.payload.interfaceId);
    const parameters: FetchModelParameters = {
        id: splitInterfaceId[0],
        token: ''
    };
    const model = yield call(fetchModelDefinition, parameters);
    checkModelIdCasing(model, splitInterfaceId[0]);
    return getFlattenedModel(model, splitInterfaceId);
}

export function* getModelDefinitionFromConfigurableRepo(action: Action<GetModelDefinitionActionParameters>) {
    const configurableRepoUrls = action.payload.locations.filter(location => location.repositoryLocationType === REPOSITORY_LOCATION_TYPE.Configurable);
    const configurableRepoUrl = configurableRepoUrls && configurableRepoUrls[0] && configurableRepoUrls[0].value || '';
    const url = configurableRepoUrl.replace(/\/$/, ''); // remove trailing slash
    const splitInterfaceId = getSplitInterfaceId(action.payload.interfaceId);
    const parameters: FetchModelParameters = {
        id: splitInterfaceId[0],
        token: '',
        url
    };
    const model = yield call(fetchModelDefinition, parameters);
    checkModelIdCasing(model, splitInterfaceId[0]);
    return getFlattenedModel(model, splitInterfaceId);
}

export function* getModelDefinitionFromLocalFile(action: Action<GetModelDefinitionActionParameters>) {
    const localFolderPaths = action.payload.locations.filter(location => location.repositoryLocationType === REPOSITORY_LOCATION_TYPE.Local);
    const localFolderPath = localFolderPaths && localFolderPaths[0] && localFolderPaths[0].value || '';
    const path = localFolderPath.replace(/\/$/, ''); // remove trailing slash
    const splitInterfaceId = getSplitInterfaceId(action.payload.interfaceId);
    const model = yield call(fetchLocalFile, path, splitInterfaceId[0]);
    return getFlattenedModel(model, splitInterfaceId);
}

export function* getModelDefinition(action: Action<GetModelDefinitionActionParameters>, location: RepositoryLocationSettings) {
    switch (location.repositoryLocationType) {
        case REPOSITORY_LOCATION_TYPE.Local:
            return yield call(getModelDefinitionFromLocalFile, action);
        case REPOSITORY_LOCATION_TYPE.Configurable:
            return yield call(getModelDefinitionFromConfigurableRepo, action);
        default:
            return yield call(getModelDefinitionFromPublicRepo, action);
    }
}

// tslint:disable-next-line
export function* expandFromExtendedModel(action: any, location: RepositoryLocationSettings, model: ModelDefinition): Generator<CallEffect<any>, ModelDefinition, ModelDefinition> {
    const extendsVal = model.extends;
    if (extendsVal) {
        if (typeof (extendsVal) === 'string') {
            const newAction: Action<GetModelDefinitionActionParameters> = { ...action };
            newAction.payload.interfaceId = extendsVal;
            let baseModel: ModelDefinition = yield call(getModelDefinition, newAction, location);
            if (baseModel.extends) {
                baseModel = yield call(expandFromExtendedModel, newAction, location, baseModel);
            }
            model.contents = model.contents.concat(baseModel.contents);
            return model;
        }
        else if (Array.isArray(extendsVal)) {
            const extendedModel = { ...model };
            for (const newInterface of extendsVal) {
                const newAction: Action<GetModelDefinitionActionParameters> = { ...action };
                newAction.payload.interfaceId = newInterface;
                let baseModel: ModelDefinition = yield call(getModelDefinition, newAction, location);
                if (baseModel.extends) {
                    baseModel = yield call(expandFromExtendedModel, newAction, location, baseModel);
                }
                extendedModel.contents = extendedModel.contents.concat(baseModel.contents);
            }
            return extendedModel;
        }
    }
    return undefined;
}
