/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { createSelector } from 'reselect';
import { ModelDefinition, PropertyContent, ContentType } from '../../../../api/models/modelDefinition';
import { StateInterface } from '../../../../shared/redux/state';
import { parseInterfacePropertyToJsonSchema } from '../../../../shared/utils/jsonSchemaAdaptor';
import { TwinWithSchema } from './devicePropertiesPerInterfacePerProperty';
import { getModelDefinitionSelector, getDigitalTwinInterfacePropertiesSelector, getInterfaceIdSelector, getInterfaceNameSelector } from '../../selectors';

export const getDevicePropertyTupleSelector = (state: StateInterface): TwinWithSchema[] => {
    const modelDefinition = getModelDefinitionSelector(state);
    return modelDefinition && getDevicePropertyProps(state, modelDefinition);
};

const getDevicePropertyProps = (state: StateInterface, model: ModelDefinition): TwinWithSchema[] => {
    const nonWritableProperties = model && model.contents && model.contents.filter((content: PropertyContent) => filterProperties(content)) as PropertyContent[];

    return nonWritableProperties && nonWritableProperties.map(property => ({
        propertyModelDefinition: property,
        propertySchema: parseInterfacePropertyToJsonSchema(property),
        reportedTwin: generateReportedTwin(state, property)
    }));
};

const filterProperties = (content: PropertyContent) => {
    if (typeof content['@type'] === 'string') {
        return content['@type'].toLowerCase() === ContentType.Property && !content.writable;
    }
    else {
        return content['@type'].some((entry: string) => entry.toLowerCase() === ContentType.Property) && !content.writable;
    }
};

// tslint:disable-next-line:cyclomatic-complexity
export const generateDigitalTwinForSpecificProperty = (state: StateInterface, property: PropertyContent) => {
    try {
        const interfaceProperties = getDigitalTwinInterfacePropertiesSelector(state);
        const interfaceNameSelected = getInterfaceNameSelector(state);
        return interfaceProperties &&
        interfaceProperties.interfaces &&
        interfaceProperties.interfaces[interfaceNameSelected] &&
        // tslint:disable-next-line:no-any
        (interfaceProperties.interfaces[interfaceNameSelected].properties)[property.name];
    } catch {
        return;
    }
};

export const generateReportedTwin = createSelector(
    generateDigitalTwinForSpecificProperty,
    property =>
    property && property.reported && property.reported.value);
