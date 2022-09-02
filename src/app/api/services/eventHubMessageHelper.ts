/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { load, Type } from 'protobufjs';
import { Message } from '../models/messages';

export const parseEventHubMessage = async (message: Message, decoderPrototype?: Type): Promise<Message> => {

    if (!message) {
        return null;
    }

    if (!message.body) {
        return message;
    }

    // if message body's type is buffer, convert to string
    if (message.body.type === 'Buffer') {
        if (decoderPrototype) {
            // TODO: try/catch
            return {
                ...message,
                body: decoderPrototype.decode(message.body.data) // new Buffer(message.body.data).toString('ascii')
            };
        }

        return {
            ...message,
            body: new Buffer(message.body.data).toString('ascii')
        };
    }

    return message;
};
