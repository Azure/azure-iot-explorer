/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { EventHubInterface, Message, StartEventHubMonitoringParameters } from '../../../../public/interfaces/eventHubInterface';
import { DeviceInterface, SendMessageToDeviceParameters } from '../../../../public/interfaces/deviceInterface';
import { CONTROLLER_API_ENDPOINT, CLOUD_TO_DEVICE, DataPlaneStatusCode, EVENTHUB, MONITOR, STOP } from './../../constants/apiConstants';
import { request } from '../services/dataplaneServiceHelper';

const EVENTHUB_CONTROLLER_ENDPOINT = `${CONTROLLER_API_ENDPOINT}${EVENTHUB}`;
export const EVENTHUB_MONITOR_ENDPOINT = `${EVENTHUB_CONTROLLER_ENDPOINT}${MONITOR}`;
export const EVENTHUB_STOP_ENDPOINT = `${EVENTHUB_CONTROLLER_ENDPOINT}${STOP}`;

export class DevicesServiceHandlers implements DeviceInterface, EventHubInterface {
    public sendMessageToDevice = async (params: SendMessageToDeviceParameters): Promise<void> => {
        await request(`${CONTROLLER_API_ENDPOINT}${CLOUD_TO_DEVICE}`, params);
    }

    public startEventHubMonitoring = async (params: StartEventHubMonitoringParameters): Promise<Message[]> => {
        const response = await request(EVENTHUB_MONITOR_ENDPOINT, params);
        if (response.status === DataPlaneStatusCode.SuccessLowerBound) {
            return await response.json() as Message[];
        }
        else {
            const error = await response.json();
            throw new Error(error && error.name);
        }
    }

    public stopEventHubMonitoring = async (): Promise<void> => {
        await request(EVENTHUB_STOP_ENDPOINT, {});
    }
}
