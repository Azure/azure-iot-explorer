/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { ModelDefinition } from './../../../../api/models/modelDefinition';
import { PropertyContent, ContentType } from '../../../../api/models/modelDefinition';
import { StateInterface } from '../../../../shared/redux/state';
import { parseInterfacePropertyToJsonSchema } from '../../../../shared/utils/jsonSchemaAdaptor';
import { getModelDefinitionSelector, getComponentNameSelector, getDigitalTwinSelector } from '../../selectors';
import { DeviceInterfaceWithSchema } from './deviceSettings';
import { getReportedValueForSpecificProperty } from '../deviceProperties/selectors';

export const getDeviceSettingTupleSelector = (state: StateInterface) => {
    const modelDefinition = getModelDefinitionSelector(state);
    return modelDefinition && generateTwinSchemaAndInterfaceTuple(state, modelDefinition);
};

const generateTwinSchemaAndInterfaceTuple = (state: StateInterface, model: ModelDefinition): DeviceInterfaceWithSchema => {
    const writableProperties = model && model.contents && model.contents.filter((item: PropertyContent) => filterProperties(item)) as PropertyContent[];

    const settings = writableProperties ? writableProperties
        .map(setting => {
            return {
                metadata: getMetadataSectionForSpecificProperty(state, setting),
                reportedTwin: getReportedValueForSpecificProperty(state, setting),
                settingModelDefinition: setting,
                settingSchema: parseInterfacePropertyToJsonSchema(setting)
            };
        }) : [];

    return {
        componentName: getComponentNameSelector(state),
        interfaceId: model['@id'],
        twinWithSchema: settings,
    };
};

export const filterProperties = (content: PropertyContent) => {
    if (typeof content['@type'] === 'string') {
        return content['@type'].toLowerCase() === ContentType.Property && content.writable;
    }
    else {
        return content['@type'].some((entry: string) => entry.toLowerCase() === ContentType.Property) && content.writable;
    }
};

export interface MetadataSection {
    desiredValue: boolean | string | number | object;
    desiredVersion: number;
    ackVersion: number;
    ackCode: number;
    ackDescription: string;
    lastUpdatedTime: string;
}

const getMetadataSectionForSpecificProperty = (state: StateInterface, property: PropertyContent): MetadataSection => {
    const digitalTwin = getDigitalTwinSelector(state);
    const componentNameSelected = getComponentNameSelector(state);
    return digitalTwin &&
        digitalTwin[componentNameSelected] &&
        digitalTwin[componentNameSelected].$metadata &&
        digitalTwin[componentNameSelected].$metadata[property.name];
};
