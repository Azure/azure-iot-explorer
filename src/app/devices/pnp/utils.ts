/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { getDeviceIdFromQueryString, getModuleIdentityIdFromQueryString } from '../../shared/utils/queryStringHelper';
import { ROUTE_PARAMS } from '../../constants/routes';
import { getDeviceTwinAction, getModuleTwinAction } from './actions';
import { ModelDefinition } from '../../api/models/modelDefinition';
import { ComponentToModelId, JsonSchemaAdaptor } from '../../shared/utils/jsonSchemaAdaptor';
import { DEFAULT_COMPONENT_FOR_DIGITAL_TWIN } from '../../constants/devices';

export const getBackUrl = (path: string, search: string) => {
    const deviceId = getDeviceIdFromQueryString(search);
    const moduleId = getModuleIdentityIdFromQueryString(search);
    let url = `${path}/?${ROUTE_PARAMS.DEVICE_ID}=${encodeURIComponent(deviceId)}`;
    if (moduleId) {
        url += `&${ROUTE_PARAMS.MODULE_ID}=${encodeURIComponent(moduleId)}`;
    }
    return url;
};

export const dispatchGetTwinAction = (search: string, dispatch: (action: any) => void) => {  // tslint:disable-line:no-any
    const deviceId = getDeviceIdFromQueryString(search);
    const moduleId = getModuleIdentityIdFromQueryString(search);
    if (moduleId) {
        dispatch(getModuleTwinAction.started({deviceId, moduleId}));
    }
    else {
        dispatch(getDeviceTwinAction.started(deviceId));
    }
};

export const getComponentNameAndInterfaceIdArray = (modelDefinition: ModelDefinition): ComponentToModelId[] => {
    if (!modelDefinition) {
        return [];
    }
    const jsonSchemaAdaptor = new JsonSchemaAdaptor(modelDefinition);
    const components = jsonSchemaAdaptor.getComponentNameToModelIdMapping();
    // check if model contains no-component items
    if (jsonSchemaAdaptor.getNonWritableProperties().length +
        jsonSchemaAdaptor.getWritableProperties().length +
        jsonSchemaAdaptor.getCommands().length +
        jsonSchemaAdaptor.getTelemetry().length > 0) {
        components.unshift({
            componentName: DEFAULT_COMPONENT_FOR_DIGITAL_TWIN,
            modelId: modelDefinition['@id']
        });
    }
    return components;
};
