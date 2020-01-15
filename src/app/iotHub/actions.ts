/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import actionCreatorFactory from 'typescript-fsa';
import { SET } from '../constants/actionTypes';
import { SharedAccessSignatureAuthorizationRule } from './models/sharedAccessSignatureAuthorizationRule';

export const IOT_HUB = 'IOT_HUB';
export const SHARED_ACCESS_SIGNATURE_AUTHORIZATION_RULES = 'SAS';

const actionCreator = actionCreatorFactory(IOT_HUB);

export const setActiveAzureResourceAction = actionCreator<SharedAccessSignatureAuthorizationRule[]>(`${SET}_${SHARED_ACCESS_SIGNATURE_AUTHORIZATION_RULES}`);
