/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import actionCreatorFactory from 'typescript-fsa';
import { DEVICECONTENT } from '../../../constants/actionPrefixes';
import { INVOKE_MODULE_IDENTITY_METHOD } from '../../../constants/actionTypes';
import { InvokeModuleMethodParameters } from '../../../api/parameters/moduleParameters';

export const invokeModuleDirectMethodAction = actionCreatorFactory(DEVICECONTENT).async<InvokeModuleMethodParameters, string>(INVOKE_MODULE_IDENTITY_METHOD);
