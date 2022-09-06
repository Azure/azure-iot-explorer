/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { ipcRenderer } from 'electron';
import { MESSAGE_CHANNELS } from '../constants';

const allowedChannels = new Set(Object.values(MESSAGE_CHANNELS));

export const invokeInMainWorld = async <T>(channel: string, ...args: Array<unknown>): Promise<T> => {
    if (!allowedChannels.has(channel)) {
        throw new Error('Denied channel');
    }

    // using customer invoker that returns the original error if handler throws.
    const { error, result } =  await ipcRenderer.invoke(channel, ...args);
    if (error) {
        throw new Error(JSON.stringify(error.message));
    }

    return result;
};
