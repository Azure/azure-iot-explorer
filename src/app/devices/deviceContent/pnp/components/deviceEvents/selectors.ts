// /***********************************************************
//  * Copyright (c) Microsoft Corporation. All rights reserved.
//  * Licensed under the MIT License
//  **********************************************************/
// import { StateInterface } from '../../../../../shared/redux/state';
// import { JsonSchemaAdaptor } from '../../../../../shared/utils/jsonSchemaAdaptor';
// import { getModelDefinitionSelector } from '../../../selectors';
// import { TelemetrySchema } from './deviceEventsPerInterface';

// export const getDeviceTelemetrySelector = (state: StateInterface): TelemetrySchema[] => {
//     const modelDefinition = getModelDefinitionSelector(state);
//     const jsonSchemaAdaptor = new JsonSchemaAdaptor(modelDefinition);
//     const telemetryContents = jsonSchemaAdaptor.getTelemetry();
//     return telemetryContents.map(telemetry => ({
//         parsedSchema: jsonSchemaAdaptor.parseInterfaceTelemetryToJsonSchema(telemetry),
//         telemetryModelDefinition: telemetry
//     }));
// };

// export default getDeviceTelemetrySelector;
