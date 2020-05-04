/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { JsonSchemaAdaptor } from './../../../../shared/utils/jsonSchemaAdaptor';
import { StateInterface } from '../../../../shared/redux/state';
import { DeviceInterfaceWithSchema } from './deviceCommands';
import { getModelDefinitionSelector } from '../../selectors';

export const getDeviceCommandPairs = (state: StateInterface): DeviceInterfaceWithSchema => {
    const modelDefinition = getModelDefinitionSelector(state);
    const jsonSchemaAdaptor = new JsonSchemaAdaptor(modelDefinition);
    const commands = jsonSchemaAdaptor.getCommands();
    return {
        commandSchemas: commands.map(command => ({
            commandModelDefinition: command,
            parsedSchema: jsonSchemaAdaptor.parseInterfaceCommandToJsonSchema(command),
        }))
    };
};

export default getDeviceCommandPairs;
