/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { ContentType, CommandContent } from '../../../../api/models/modelDefinition';
import { parseInterfaceCommandToJsonSchema } from './../../../../shared/utils/jsonSchemaAdaptor';
import { StateInterface } from '../../../../shared/redux/state';
import { DeviceInterfaceWithSchema } from './deviceCommands';
import { getModelDefinitionSelector } from '../../selectors';

export const getDeviceCommandPairs = (state: StateInterface): DeviceInterfaceWithSchema => {
    const modelDefinition = getModelDefinitionSelector(state);
    const commands = modelDefinition && modelDefinition.contents && modelDefinition.contents.filter((item: CommandContent) => filterCommand(item));
    return {
        commandSchemas: commands ? commands.map(command => ({
            commandModelDefinition: command,
            parsedSchema: parseInterfaceCommandToJsonSchema(command),
        })) : []
    };
};

const filterCommand = (content: CommandContent) => {
    if (typeof content['@type'] === 'string') {
        return content['@type'].toLowerCase() === ContentType.Command;
    }
    else {
        return content['@type'].some((entry: string) => entry.toLowerCase() === ContentType.Command);
    }
};

export default getDeviceCommandPairs;
