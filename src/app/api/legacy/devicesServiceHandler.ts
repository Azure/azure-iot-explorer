/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { DeviceInterface, SendMessageToDeviceParameters } from '../../../../public/interfaces/deviceInterface';
import { CONTROLLER_API_ENDPOINT, CLOUD_TO_DEVICE, EVENTHUB, MONITOR, STOP } from '../../constants/apiConstants';
import { request } from '../services/dataplaneServiceHelper';

const EVENTHUB_CONTROLLER_ENDPOINT = `${CONTROLLER_API_ENDPOINT}${EVENTHUB}`;
export const EVENTHUB_MONITOR_ENDPOINT = `${EVENTHUB_CONTROLLER_ENDPOINT}${MONITOR}`;
export const EVENTHUB_STOP_ENDPOINT = `${EVENTHUB_CONTROLLER_ENDPOINT}${STOP}`;

export class DevicesServiceHandler implements DeviceInterface {
    public sendMessageToDevice = async (params: SendMessageToDeviceParameters): Promise<void> => {
        await request(`${CONTROLLER_API_ENDPOINT}${CLOUD_TO_DEVICE}`, params);
    }
}
