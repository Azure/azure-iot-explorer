/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import actionCreatorFactory from 'typescript-fsa';
import * as actionPrefixes from '../../../constants/actionPrefixes';
import * as actionTypes from '../../../constants/actionTypes';

export const invokeDirectMethodAction = actionCreatorFactory(actionPrefixes.DEVICECONTENT).async<InvokeMethodActionParameters, string>(actionTypes.INVOKE_DEVICE_METHOD);

export interface InvokeMethodActionParameters {
    connectTimeoutInSeconds: number;
    deviceId: string;
    methodName: string;
    payload?: object;
    responseTimeoutInSeconds: number;
}
