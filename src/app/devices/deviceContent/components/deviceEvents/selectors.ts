/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { StateInterface } from './../../../../shared/redux/state';
import { ContentType, TelemetryContent } from '../../../../api/models/modelDefinition';
import { parseInterfaceTelemetryToJsonSchema } from './../../../../shared/utils/jsonSchemaAdaptor';
import { getModelDefinitionSelector } from '../../selectors';
import { TelemetrySchema } from './deviceEventsPerInterface';

export const getDeviceTelemetrySelector = (state: StateInterface): TelemetrySchema[] => {
    const modelDefinition = getModelDefinitionSelector(state);
    const telemetryContents = modelDefinition && modelDefinition.contents && modelDefinition.contents.filter((item: TelemetryContent) => filterTelemetry(item)) as TelemetryContent[];
    return telemetryContents && telemetryContents.map(telemetry => ({
        parsedSchema: parseInterfaceTelemetryToJsonSchema(telemetry),
        telemetryModelDefinition: telemetry
    }));
};

const filterTelemetry = (content: TelemetryContent) => {
    if (typeof content['@type'] === 'string') {
        return content['@type'].toLowerCase() === ContentType.Telemetry;
    }
    else {
        return content['@type'].some((entry: string) => entry.toLowerCase() === ContentType.Telemetry);
    }
};

export default getDeviceTelemetrySelector;
