/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import actionCreatorFactory from 'typescript-fsa';
import { DEVICECONTENT } from '../../../constants/actionPrefixes';
import { INVOKE_MODULE_IDENTITY_METHOD } from '../../../constants/actionTypes';

export const invokeModuleDirectMethodAction = actionCreatorFactory(DEVICECONTENT).async<InvokeModuleMethodActionParameters, string>(INVOKE_MODULE_IDENTITY_METHOD);

export interface InvokeModuleMethodActionParameters {
    connectTimeoutInSeconds: number;
    deviceId: string;
    methodName: string;
    moduleId: string;
    payload?: any; // tslint:disable-line:no-any
    responseTimeoutInSeconds: number;
}
