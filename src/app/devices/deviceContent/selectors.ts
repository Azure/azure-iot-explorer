/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { createSelector } from 'reselect';
import { DeviceIdentity } from '../../api/models/deviceIdentity';
import { SynchronizationWrapper } from '../../api/models/synchronizationWrapper';
import { DigitalTwinInterfaces } from '../../api/models/digitalTwinModels';
import { StateInterface } from '../../shared/redux/state';
import { ModelDefinitionWithSource } from '../../api/models/modelDefinitionWithSource';
import { SynchronizationStatus } from './../../api/models/synchronizationStatus';
import { ComponentContent, ContentType } from './../../api/models/modelDefinition';

//#region DeviceIdentity-related selectors
export const getDeviceIdentityWrapperSelector = (state: StateInterface): SynchronizationWrapper<DeviceIdentity> => {
    return state &&
        state.deviceContentState &&
        state.deviceContentState.deviceIdentity;
};
//#endregion

//#region ModelDefinition-related selectors
export interface ComponentAndInterfaceId {
    componentName: string;
    interfaceId: string;
}

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

export const getComponentNameAndInterfaceIdArraySelector = (state: StateInterface): ComponentAndInterfaceId[] => {
    const modelDefinition = getModelDefinitionSelector(state);
    const componentContents = modelDefinition && modelDefinition.contents && modelDefinition.contents.filter((item: ComponentContent) => filterTelemetry(item)) as ComponentContent[];
    return componentContents ? componentContents.map(componentContent => ({
        componentName: componentContent.name,
        interfaceId: componentContent.schema
    })) : [];
};

const filterTelemetry = (content: ComponentContent) => {
    if (typeof content['@type'] === 'string') {
        return content['@type'].toLowerCase() === ContentType.Component;
    }
    else {
        return false;
    }
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
