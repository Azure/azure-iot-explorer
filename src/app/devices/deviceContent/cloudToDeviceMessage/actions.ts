/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import actionCreatorFactory from 'typescript-fsa';
import { DEVICECONTENT } from '../../../constants/actionPrefixes';
import { CLOUD_TO_DEVICE_MESSAGE } from '../../../constants/actionTypes';

export const cloudToDeviceMessageAction = actionCreatorFactory(DEVICECONTENT).async<CloudToDeviceMessageActionParameters, string>(CLOUD_TO_DEVICE_MESSAGE);

export interface CloudToDeviceMessageActionParameters {
    deviceId: string;
    body: string;
    properties?: Array<{key: string, value: string, isSystemProperty: boolean}>;
}
