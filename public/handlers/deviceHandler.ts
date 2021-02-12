/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { IpcMainInvokeEvent } from 'electron';
import { Client } from 'azure-iothub';
import { Message as CloudToDeviceMessage } from 'azure-iot-common';
import { SendMessageToDeviceParameters, MessageProperty } from '../interfaces/deviceInterface';

export const onSendMessageToDevice = async (event: IpcMainInvokeEvent, params: SendMessageToDeviceParameters): Promise<void> => {
    const { deviceId, messageProperties, messageBody, connectionString } = params;
    const hubClient = Client.fromConnectionString(connectionString);

    try {
        const message = new CloudToDeviceMessage(messageBody);
        addPropertiesToCloudToDeviceMessage(message, messageProperties || []);

        await hubClient.open();
        await hubClient.send(deviceId, message);
        // tslint:disable-next-line: no-console
        console.log('sent');
    } finally {
        // tslint:disable-next-line: no-console
        console.log('closing');
        await hubClient.close();
    }
};

// tslint:disable-next-line:cyclomatic-complexity
export const addPropertiesToCloudToDeviceMessage = (message: CloudToDeviceMessage, properties: MessageProperty[]) => {
    if (!properties || properties.length === 0) {
        return;
    }
    for (const property of properties) {
        if (property.isSystemProperty) {
            switch (property.key) {
                case 'ack':
                    message.ack = property.value;
                    break;
                case 'contentType':
                    message.contentType = property.value as any; // tslint:disable-line:no-any
                    break;
                case 'correlationId':
                    message.correlationId = property.value;
                    break;
                case 'contentEncoding':
                    message.contentEncoding = property.value as any; // tslint:disable-line:no-any
                    break;
                case 'expiryTimeUtc':
                    message.expiryTimeUtc = parseInt(property.value); // tslint:disable-line:radix
                    break;
                case 'messageId':
                    message.messageId = property.value;
                    break;
                case 'lockToken':
                    message.lockToken = property.value;
                    break;
                default:
                    message.properties.add(property.key, property.value);
                    break;
            }
        }
        else {
            message.properties.add(property.key, property.value);
        }
    }
};
