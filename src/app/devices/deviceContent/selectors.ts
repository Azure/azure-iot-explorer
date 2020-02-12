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
import { modelDiscoveryInterfaceName } from '../../constants/modelDefinitionConstants';

export const getInterfaceIdSelector = (state: StateInterface): string => {
    return state && state.deviceContentState && state.deviceContentState.interfaceIdSelected;
};

export const getModelDefinitionWithSourceSelector = (state: StateInterface): SynchronizationWrapper<ModelDefinitionWithSource> => {
    return getInterfaceIdSelector(state) &&
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

export const getDigitalTwinInterfaceNameAndIdsSelector = createSelector(
    getDigitalTwinInterfacePropertiesSelector,
    properties => {
        return getReportedInterfacesFromDigitalTwin(properties);
    }
);

// tslint:disable-next-line:cyclomatic-complexity
export const getReportedInterfacesFromDigitalTwin = (properties: DigitalTwinInterfaces) => {
    return properties &&
        properties.interfaces &&
        properties.interfaces[modelDiscoveryInterfaceName] &&
        properties.interfaces[modelDiscoveryInterfaceName].properties &&
        properties.interfaces[modelDiscoveryInterfaceName].properties.modelInformation &&
        properties.interfaces[modelDiscoveryInterfaceName].properties.modelInformation.reported &&
        properties.interfaces[modelDiscoveryInterfaceName].properties.modelInformation.reported.value &&
        properties.interfaces[modelDiscoveryInterfaceName].properties.modelInformation.reported.value.interfaces;
};

export const getDigitalTwinInterfaceIdToNameMapSelector = createSelector(
    getDigitalTwinInterfaceNameAndIdsSelector,
    nameAndIds => {
        const idToNameMap = new Map<string, string>();
        if (nameAndIds) {
            Object.keys(nameAndIds).map(
                name => { idToNameMap.set(nameAndIds[name], name); });
            return idToNameMap;
        }
        return idToNameMap;
    }
);

export const getDigitalTwinInterfaceIdsSelector = createSelector(
    getDigitalTwinInterfaceNameAndIdsSelector,
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
    getDigitalTwinInterfaceNameAndIdsSelector,
    names => names && Object.keys(names).length > 0);

export const getInterfaceNameSelector = createSelector(
    getInterfaceIdSelector,
    getDigitalTwinInterfaceIdToNameMapSelector,
    (id, idToNameMap) => {
        return idToNameMap.get(id);
    }
);
