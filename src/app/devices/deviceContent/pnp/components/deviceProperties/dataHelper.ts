import { ModelDefinition } from '../../../../../api/models/modelDefinition';
import { JsonSchemaAdaptor } from '../../../../../shared/utils/jsonSchemaAdaptor';
import { TwinWithSchema } from './devicePropertiesPerInterface';

// tslint:disable-next-line: no-any
export const getDevicePropertyProps = (model: ModelDefinition, digitalTwinForSpecificComponent: any): TwinWithSchema[] => {
    if (model) {
        return [];
    }
    const jsonSchemaAdaptor = new JsonSchemaAdaptor(model);
    const nonWritableProperties = jsonSchemaAdaptor.getNonWritableProperties();

    return nonWritableProperties.map(property => ({
        propertyModelDefinition: property,
        propertySchema: jsonSchemaAdaptor.parseInterfacePropertyToJsonSchema(property),
        reportedTwin: digitalTwinForSpecificComponent && digitalTwinForSpecificComponent[property.name]
    }));
};
