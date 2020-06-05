/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { JsonSchemaAdaptor } from '../../../../../shared/utils/jsonSchemaAdaptor';
import { ModelDefinition } from '../../../../../api/models/modelDefinition';
import { TwinWithSchema } from './deviceSettingsPerInterfacePerSetting';

export interface DeviceInterfaceWithSchema {
    twinWithSchema: TwinWithSchema[];
}

export const generateTwinSchemaAndInterfaceTuple = (model: ModelDefinition, digitalTwin: object, componentName: string): DeviceInterfaceWithSchema => {
    if (!model) {
        return { twinWithSchema: [] };
    }
    const jsonSchemaAdaptor = new JsonSchemaAdaptor(model);
    const writableProperties = jsonSchemaAdaptor.getWritableProperties();
    const digitalTwinForSpecificComponent = digitalTwin && (digitalTwin as any)[componentName]; // tslint:disable-line: no-any

    const settings = writableProperties
        .map(setting => {
            return {
                isComponentContainedInDigitalTwin: !!digitalTwinForSpecificComponent,
                metadata: digitalTwinForSpecificComponent && digitalTwinForSpecificComponent.$metaData && digitalTwinForSpecificComponent.$metadata[setting.name],
                reportedTwin: digitalTwinForSpecificComponent && digitalTwinForSpecificComponent[setting.name],
                settingModelDefinition: setting,
                settingSchema: jsonSchemaAdaptor.parseInterfacePropertyToJsonSchema(setting)
            };
        });

    return {
        twinWithSchema: settings,
    };
};
