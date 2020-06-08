/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { ModelDefinition } from '../../../../../api/models/modelDefinition';
import { JsonSchemaAdaptor } from '../../../../../shared/utils/jsonSchemaAdaptor';
import { CommandSchema } from './deviceCommandsPerInterfacePerCommand';

interface DeviceCommandsWithSchema {
    commandSchemas: CommandSchema[];
}

export const getDeviceCommandPairs = (modelDefinition: ModelDefinition): DeviceCommandsWithSchema => {
    const jsonSchemaAdaptor = new JsonSchemaAdaptor(modelDefinition);
    const commands = jsonSchemaAdaptor.getCommands();
    return {
        // tslint:disable-next-line: no-any
        commandSchemas: commands.map((command: any) => ({
            commandModelDefinition: command,
            parsedSchema: jsonSchemaAdaptor.parseInterfaceCommandToJsonSchema(command),
        }))
    };
};
