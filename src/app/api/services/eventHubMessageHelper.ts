/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { Message } from '../models/messages';

export const parseEventHubMessage = (message: Message): Message => {

    if (!message) {
        return null;
    }

    if (!message.body) {
        return message;
    }

    // if message body's type is buffer, convert to string
    if (message.body.type === 'Buffer') {
        return {
            ...message,
            body: new Buffer(message.body.data).toString('ascii')
        };
    }

    return message;
};
