/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { JsonSchemaAdaptor } from '../../../../shared/utils/jsonSchemaAdaptor';
import { ModelDefinition, PropertyContent } from '../../../../api/models/modelDefinition';
import { ParsedJsonSchema } from '../../../../api/models/interfaceJsonParserOutput';
import { ModuleTwin } from '../../../../api/models/moduleTwin';
import { Twin } from '../../../../api/models/device';
import { DEFAULT_COMPONENT_FOR_DIGITAL_TWIN } from '../../../../constants/devices';

export interface ReportedSection {
    value?: boolean | string | number | object;
    ac?: number;
    ad?: string;
    av?: number;
}

export interface TwinWithSchema {
    settingModelDefinition: PropertyContent;
    settingSchema: ParsedJsonSchema;
    desiredValue?: boolean | string | number | object;
    reportedSection?: ReportedSection;
}

export const generateTwinSchemaAndInterfaceTuple = (model: ModelDefinition, twin: Twin | ModuleTwin, componentName: string): TwinWithSchema[] => {
    if (!model) {
        return [];
    }
    const jsonSchemaAdaptor = new JsonSchemaAdaptor(model);
    const writablePropertyModelDefinitions = jsonSchemaAdaptor.getWritableProperties();

    const settings = writablePropertyModelDefinitions
        .map(writablePropertyModelDefinition => {
            return {
                desiredValue: getDesiredPropertiesForSpecficComponent(twin, componentName)?.[writablePropertyModelDefinition.name],
                reportedSection: getReportedPropertiesForSpecficComponent(twin, componentName)?.[writablePropertyModelDefinition.name],
                settingModelDefinition: writablePropertyModelDefinition,
                settingSchema: jsonSchemaAdaptor.parseInterfacePropertyToJsonSchema(writablePropertyModelDefinition)
            };
        });

    return settings;
};

export const getReportedPropertiesForSpecficComponent = (twin: Twin | ModuleTwin, componentName: string) => {
    const reportedTwin = twin?.properties?.reported;
    return componentName === DEFAULT_COMPONENT_FOR_DIGITAL_TWIN ?
        reportedTwin : (reportedTwin as any)?.[componentName]; // tslint:disable-line: no-any
};

export const getDesiredPropertiesForSpecficComponent = (twin: Twin | ModuleTwin, componentName: string) => {
    const desiredTwin = twin?.properties?.desired;
    return componentName === DEFAULT_COMPONENT_FOR_DIGITAL_TWIN ?
        desiredTwin : (desiredTwin as any)?.[componentName]; // tslint:disable-line: no-any
};
