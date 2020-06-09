/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { ModelDefinition, TelemetryContent } from '../../../../api/models/modelDefinition';
import { JsonSchemaAdaptor } from '../../../../shared/utils/jsonSchemaAdaptor';
import { ParsedJsonSchema } from '../../../../api/models/interfaceJsonParserOutput';

export interface TelemetrySchema {
    parsedSchema: ParsedJsonSchema;
    telemetryModelDefinition: TelemetryContent;
}

export const getDeviceTelemetry = (modelDefinition: ModelDefinition): TelemetrySchema[] => {
    if (!modelDefinition) {
        return [];
    }
    const jsonSchemaAdaptor = new JsonSchemaAdaptor(modelDefinition);
    const telemetryContents = jsonSchemaAdaptor.getTelemetry();
    return telemetryContents.map(telemetry => ({
        parsedSchema: jsonSchemaAdaptor.parseInterfaceTelemetryToJsonSchema(telemetry),
        telemetryModelDefinition: telemetry
    }));
};
