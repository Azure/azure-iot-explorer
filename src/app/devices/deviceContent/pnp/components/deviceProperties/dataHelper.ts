/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { ModelDefinition, PropertyContent } from '../../../../../api/models/modelDefinition';
import { JsonSchemaAdaptor } from '../../../../../shared/utils/jsonSchemaAdaptor';
import { ParsedJsonSchema } from '../../../../../api/models/interfaceJsonParserOutput';

export interface TwinWithSchema {
    propertyModelDefinition: PropertyContent;
    propertySchema: ParsedJsonSchema;
    reportedTwin: boolean | string | number | object;
}

export const generateReportedTwinSchemaAndInterfaceTuple = (model: ModelDefinition, digitalTwin: object, componentName: string): TwinWithSchema[] => {
    if (!model) {
        return [];
    }
    const jsonSchemaAdaptor = new JsonSchemaAdaptor(model);
    const nonWritableProperties = jsonSchemaAdaptor.getNonWritableProperties();
    const digitalTwinForSpecificComponent = digitalTwin && (digitalTwin as any)[componentName]; // tslint:disable-line: no-any

    return nonWritableProperties.map(property => ({
        propertyModelDefinition: property,
        propertySchema: jsonSchemaAdaptor.parseInterfacePropertyToJsonSchema(property),
        reportedTwin: digitalTwinForSpecificComponent && digitalTwinForSpecificComponent[property.name]
    }));
};
