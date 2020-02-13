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

export const getComponentNameSelector = (state: StateInterface): string => {
    return state && state.deviceContentState && state.deviceContentState.componentNameSelected;
};

export const getModelDefinitionWithSourceSelector = (state: StateInterface): SynchronizationWrapper<ModelDefinitionWithSource> => {
    return getComponentNameSelector(state) &&
        state.deviceContentState &&
        state.deviceContentState.modelDefinitionWithSource;
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

const getReportedDcmFromDigitalTwin = (properties: DigitalTwinInterfaces) => {
    const value = getReportedValueFromDigitalTwin(properties);
    return value && value.modelId;
};

export const getDigitalTwinDcmNameSelector = createSelector(
    getDigitalTwinInterfacePropertiesSelector,
    properties => {
        return getReportedDcmFromDigitalTwin(properties);
    }
);

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

export const getIsDevicePnpSelector = createSelector(
    getDigitalTwinComponentNameAndIdsSelector,
    names => names && Object.keys(names).length > 0);
