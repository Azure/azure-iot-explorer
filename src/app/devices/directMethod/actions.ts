/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import actionCreatorFactory from 'typescript-fsa';
import { DEVICECONTENT } from '../../constants/actionPrefixes';
import { INVOKE_DEVICE_METHOD } from '../../constants/actionTypes';
import { InvokeMethodParameters } from '../../api/parameters/deviceParameters';

export const invokeDirectMethodAction = actionCreatorFactory(DEVICECONTENT).async<InvokeMethodParameters, string>(INVOKE_DEVICE_METHOD);
