/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { JsonSchemaAdaptor } from '../../../../shared/utils/jsonSchemaAdaptor';
import { ModelDefinition, PropertyContent } from '../../../../api/models/modelDefinition';
import { ParsedJsonSchema } from '../../../../api/models/interfaceJsonParserOutput';
import { MetadataSection } from './deviceSettingsPerInterfacePerSetting';
import { DEFAULT_COMPONENT_FOR_DIGITAL_TWIN } from '../../../../constants/devices';

export interface DeviceInterfaceWithSchema {
    twinWithSchema: TwinWithSchema[];
}

export interface TwinWithSchema {
    isComponentContainedInDigitalTwin: boolean;
    metadata: MetadataSection;
    reportedTwin: boolean | string | number | object;
    settingModelDefinition: PropertyContent;
    settingSchema: ParsedJsonSchema;
}

export const generateTwinSchemaAndInterfaceTuple = (model: ModelDefinition, digitalTwin: object, componentName: string): DeviceInterfaceWithSchema => {
    if (!model) {
        return { twinWithSchema: [] };
    }
    const jsonSchemaAdaptor = new JsonSchemaAdaptor(model);
    const writableProperties = jsonSchemaAdaptor.getWritableProperties();
    const digitalTwinForSpecificComponent = componentName === DEFAULT_COMPONENT_FOR_DIGITAL_TWIN ?
        digitalTwin : digitalTwin && (digitalTwin as any)[componentName]; // tslint:disable-line: no-any

    const settings = writableProperties
        .map(setting => {
            return {
                isComponentContainedInDigitalTwin: !!digitalTwinForSpecificComponent,
                metadata: digitalTwinForSpecificComponent && digitalTwinForSpecificComponent.$metadata && digitalTwinForSpecificComponent.$metadata[setting.name],
                reportedTwin: digitalTwinForSpecificComponent && digitalTwinForSpecificComponent[setting.name],
                settingModelDefinition: setting,
                settingSchema: jsonSchemaAdaptor.parseInterfacePropertyToJsonSchema(setting)
            };
        });

    return {
        twinWithSchema: settings,
    };
};
