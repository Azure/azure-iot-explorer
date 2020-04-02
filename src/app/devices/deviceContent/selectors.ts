/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { createSelector } from 'reselect';
import { DeviceIdentity } from '../../api/models/deviceIdentity';
import { SynchronizationWrapper } from '../../api/models/synchronizationWrapper';
import { DigitalTwinInterfaces } from '../../api/models/digitalTwinModels';
import { StateType, StateInterface } from '../../shared/redux/state';
import { ModelDefinitionWithSource } from '../../api/models/modelDefinitionWithSource';
import { modelDiscoveryComponentName } from '../../constants/modelDefinitionConstants';
import { SynchronizationStatus } from './../../api/models/synchronizationStatus';
import { ComponentContent, ContentType } from './../../api/models/modelDefinition';

export interface ComponentAndInterfaceId {
    componentName: string;
    interfaceId: string;
}

export const getComponentNameSelector = (state: StateInterface): string => {
    return state && state.deviceContentState && state.deviceContentState.componentNameSelected;
};

export const getModelDefinitionWithSourceSelector = (state: StateInterface): SynchronizationWrapper<ModelDefinitionWithSource> => {
    return state.deviceContentState && state.deviceContentState.modelDefinitionWithSource;
};

export const getComponentToInterfaceIdMappingSelector = (state: StateInterface): ComponentAndInterfaceId[] => {
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
        return content['@type'].some((entry: string) => entry.toLowerCase() === ContentType.Component);
    }
};

export const getModelDefinitionSelector = createSelector(
    getModelDefinitionWithSourceSelector,
    interfaceWithSource => interfaceWithSource && interfaceWithSource.payload && interfaceWithSource.payload.modelDefinition);

export const getModelDefinitionSyncStatusSelector = createSelector(
    getModelDefinitionWithSourceSelector,
    modelDefinitionWithSource => {
        return modelDefinitionWithSource && modelDefinitionWithSource.synchronizationStatus;
    }
);

export const getDeviceIdentityWrapperSelector = (state: StateType): SynchronizationWrapper<DeviceIdentity> => {
    return state &&
        state.deviceContentState &&
        state.deviceContentState.deviceIdentity &&
        state.deviceContentState.deviceIdentity;
};

export const getDigitalTwinInterfacePropertiesWrapperSelector = (state: StateType): SynchronizationWrapper<DigitalTwinInterfaces> => {
    return state &&
        state.deviceContentState &&
        state.deviceContentState.digitalTwinInterfaceProperties;
};

export const getDigitalTwinInterfacePropertiesStateSelector = createSelector(
    getDigitalTwinInterfacePropertiesWrapperSelector,
    properties => {
        return properties && properties.synchronizationStatus;
    }
);

export const getDigitalTwinInterfacePropertiesSelector = (state: StateInterface): DigitalTwinInterfaces => {
    return state &&
        state.deviceContentState &&
        state.deviceContentState.digitalTwinInterfaceProperties &&
        state.deviceContentState.digitalTwinInterfaceProperties.payload;
};

export const getDigitalTwinComponentNameAndIdsSelector = createSelector(
    getDigitalTwinInterfacePropertiesSelector,
    properties => {
        return getReportedInterfacesFromDigitalTwin(properties);
    }
);

// tslint:disable-next-line:cyclomatic-complexity
const getReportedValueFromDigitalTwin = (properties: DigitalTwinInterfaces) => {
    return properties &&
        properties.interfaces &&
        properties.interfaces[modelDiscoveryComponentName] &&
        properties.interfaces[modelDiscoveryComponentName].properties &&
        properties.interfaces[modelDiscoveryComponentName].properties.modelInformation &&
        properties.interfaces[modelDiscoveryComponentName].properties.modelInformation.reported &&
        properties.interfaces[modelDiscoveryComponentName].properties.modelInformation.reported.value &&
        properties.interfaces[modelDiscoveryComponentName].properties.modelInformation.reported.value;
};

const getReportedInterfacesFromDigitalTwin = (properties: DigitalTwinInterfaces) => {
    const value = getReportedValueFromDigitalTwin(properties);
    return value && value.interfaces;
};

export const getDigitalTwinInterfaceIdsSelector = createSelector(
    getDigitalTwinComponentNameAndIdsSelector,
    nameAndIds => {
        if (nameAndIds) {
            const interfaceIds = Object.keys(nameAndIds).map(
                key => nameAndIds[key]);
            return interfaceIds;
        }
        return [];
    }
);

export const getDigitalTwinSynchronizationStatusSelector = (state: StateInterface): SynchronizationStatus => {
    return state &&
        state.deviceContentState &&
        state.deviceContentState.digitalTwin &&
        state.deviceContentState.digitalTwin.synchronizationStatus;
};

// tslint:disable-next-line:no-any
const getDigitalTwinSelector = (state: StateInterface): any => {
    return state &&
        state.deviceContentState &&
        state.deviceContentState.digitalTwin &&
        state.deviceContentState.digitalTwin.payload;
};

export const getDigitalTwinModelId = createSelector(
    getDigitalTwinSelector,
    dt => dt &&  dt.$metadata && dt.$metadata.$model);
