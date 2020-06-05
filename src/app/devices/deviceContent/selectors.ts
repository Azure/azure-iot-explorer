/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { createSelector } from 'reselect';
import { SynchronizationWrapper } from '../../api/models/synchronizationWrapper';
import { StateInterface } from '../../shared/redux/state';
import { ModelDefinitionWithSource } from '../../api/models/modelDefinitionWithSource';
import { SynchronizationStatus } from './../../api/models/synchronizationStatus';
import { JsonSchemaAdaptor, ComponentAndInterfaceId } from '../../shared/utils/jsonSchemaAdaptor';

//#region ModelDefinition-related selectors
export const getComponentNameSelector = (state: StateInterface): string => {
    return state && state.deviceContentState && state.deviceContentState.componentNameSelected;
};

export const getModelDefinitionWithSourceWrapperSelector = (state: StateInterface): SynchronizationWrapper<ModelDefinitionWithSource> => {
    return state.deviceContentState && state.deviceContentState.modelDefinitionWithSource;
};

export const getModelDefinitionWithSourceSelector = createSelector(
    getModelDefinitionWithSourceWrapperSelector,
    interfaceWithSourceWrapper => interfaceWithSourceWrapper && interfaceWithSourceWrapper.payload
);

export const getModelDefinitionSelector = createSelector(
    getModelDefinitionWithSourceSelector,
    interfaceWithSource => interfaceWithSource && interfaceWithSource.modelDefinition
);

export const getModelDefinitionSyncStatusSelector = createSelector(
    getModelDefinitionWithSourceWrapperSelector,
    modelDefinitionWithSource => modelDefinitionWithSource && modelDefinitionWithSource.synchronizationStatus
);

export const defaultComponentKey = '$default';
export const getComponentNameAndInterfaceIdArraySelector = (state: StateInterface): ComponentAndInterfaceId[] => {
    const modelDefinition = getModelDefinitionSelector(state);
    const jsonSchemaAdaptor = new JsonSchemaAdaptor(modelDefinition);
    const components = jsonSchemaAdaptor.getComponentNameAndInterfaceIdArray();
    // check if model contains no-component items
    if (jsonSchemaAdaptor.getNonWritableProperties().length +
        jsonSchemaAdaptor.getWritableProperties().length +
        jsonSchemaAdaptor.getCommands().length +
        jsonSchemaAdaptor.getTelemetry().length > 0) {
        components.unshift({
            componentName: defaultComponentKey,
            interfaceId: modelDefinition['@id']
        });
    }
    return components;
};
//#endregion

//#region DigitalTwin-related selectors
export const getDigitalTwinSynchronizationStatusSelector = (state: StateInterface): SynchronizationStatus => {
    return state &&
        state.deviceContentState &&
        state.deviceContentState.digitalTwin &&
        state.deviceContentState.digitalTwin.synchronizationStatus;
};

// tslint:disable-next-line:no-any
export const getDigitalTwinSelector = (state: StateInterface): any => {
    return state &&
        state.deviceContentState &&
        state.deviceContentState.digitalTwin &&
        state.deviceContentState.digitalTwin.payload;
};

export const getDigitalTwinModelId = createSelector(
    getDigitalTwinSelector,
    digitalTwin => digitalTwin &&  digitalTwin.$metadata && digitalTwin.$metadata.$model
);
//#endregion
