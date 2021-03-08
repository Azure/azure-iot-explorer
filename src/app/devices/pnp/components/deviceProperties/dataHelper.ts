/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { ModelDefinition, PropertyContent } from '../../../../api/models/modelDefinition';
import { JsonSchemaAdaptor } from '../../../../shared/utils/jsonSchemaAdaptor';
import { ParsedJsonSchema } from '../../../../api/models/interfaceJsonParserOutput';
import { ModuleTwin } from '../../../../api/models/moduleTwin';
import { Twin } from '../../../../api/models/device';
import { getReportedPropertiesForSpecficComponent } from '../deviceSettings/dataHelper';

export interface TwinWithSchema {
    propertyModelDefinition: PropertyContent;
    propertySchema: ParsedJsonSchema;
    reportedTwin: boolean | string | number | object;
}

export const generateReportedTwinSchemaAndInterfaceTuple = (model: ModelDefinition, twin: Twin | ModuleTwin, componentName: string): TwinWithSchema[] => {
    if (!model) {
        return [];
    }
    const jsonSchemaAdaptor = new JsonSchemaAdaptor(model);
    const nonWritableProperties = jsonSchemaAdaptor.getNonWritableProperties();

    return nonWritableProperties.map(property => ({
        propertyModelDefinition: property,
        propertySchema: jsonSchemaAdaptor.parseInterfacePropertyToJsonSchema(property),
        // digitalTwinForSpecificComponent is required to always have a $metadata key
        reportedTwin: getReportedPropertiesForSpecficComponent(twin, componentName)?.[property.name]
    }));
};
