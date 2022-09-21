/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { Message as CloudToDeviceMessage } from 'azure-iot-common';
import { MessageProperty } from '../interfaces/deviceInterface';

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
