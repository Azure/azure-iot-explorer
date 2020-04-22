/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { ModelDefinition, PropertyContent, ContentType } from '../../../../api/models/modelDefinition';
import { StateInterface } from '../../../../shared/redux/state';
import { parseInterfacePropertyToJsonSchema } from '../../../../shared/utils/jsonSchemaAdaptor';
import { TwinWithSchema } from './devicePropertiesPerInterface';
import { getModelDefinitionSelector, getComponentNameSelector, getDigitalTwinSelector } from '../../selectors';

export const getDevicePropertyTupleSelector = (state: StateInterface): TwinWithSchema[] => {
    const modelDefinition = getModelDefinitionSelector(state);
    return modelDefinition && getDevicePropertyProps(state, modelDefinition);
};

const getDevicePropertyProps = (state: StateInterface, model: ModelDefinition): TwinWithSchema[] => {
    const nonWritableProperties = model && model.contents && model.contents.filter((content: PropertyContent) => filterProperties(content)) as PropertyContent[];

    return nonWritableProperties ? nonWritableProperties.map(property => ({
        propertyModelDefinition: property,
        propertySchema: parseInterfacePropertyToJsonSchema(property),
        reportedTwin: getReportedValueForSpecificProperty(state, property)
    })) : [];
};

export const filterProperties = (content: PropertyContent) => {
    if (typeof content['@type'] === 'string') {
        return content['@type'].toLowerCase() === ContentType.Property && !content.writable;
    }
    else {
        return content['@type'].some((entry: string) => entry.toLowerCase() === ContentType.Property) && !content.writable;
    }
};

export const getDigitalTwinForSpecificComponent = (state: StateInterface) => {
    const digitalTwin = getDigitalTwinSelector(state);
    const componentNameSelected = getComponentNameSelector(state);
    return digitalTwin && digitalTwin[componentNameSelected];
};

export const getReportedValueForSpecificProperty = (state: StateInterface, property: PropertyContent): boolean | string | number | object => {
    const digitalTwinForSpecificComponent = getDigitalTwinForSpecificComponent (state);
    return digitalTwinForSpecificComponent && digitalTwinForSpecificComponent[property.name];
};
