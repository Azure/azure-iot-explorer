/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import actionCreatorFactory from 'typescript-fsa';
import { DEVICECONTENT } from '../../constants/actionPrefixes';
import { INVOKE_DEVICE_METHOD } from '../../constants/actionTypes';

export const invokeDirectMethodAction = actionCreatorFactory(DEVICECONTENT).async<InvokeMethodActionParameters, string>(INVOKE_DEVICE_METHOD);

export interface InvokeMethodActionParameters {
    connectTimeoutInSeconds: number;
    deviceId: string;
    methodName: string;
    payload?: string;
    responseTimeoutInSeconds: number;
}
