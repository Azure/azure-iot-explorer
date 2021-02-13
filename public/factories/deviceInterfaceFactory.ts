/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { MESSAGE_CHANNELS } from '../constants';
import { DeviceInterface, SendMessageToDeviceParameters } from '../interfaces/deviceInterface';
import { invokeInMainWorld } from '../utils/invokeHelper';

export const generateDeviceInterface = (): DeviceInterface => {
    return {
        sendMessageToDevice: async (params: SendMessageToDeviceParameters): Promise<void> => {
            return invokeInMainWorld<void>(MESSAGE_CHANNELS.DEVICE_SEND_MESSAGE, params);
        },
    };
};
