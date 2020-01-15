/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { Map } from 'immutable';
import { SharedAccessSignatureAuthorizationRule } from './models/sharedAccessSignatureAuthorizationRule';
import { LastRetrievedWrapper } from '../api/models/lastRetrievedWrapper';

export interface IotHubStateInterface {
     sharedAccessSignatureAuthorizationRules: Map<string, LastRetrievedWrapper<SharedAccessSignatureAuthorizationRule[]>>;
}

export const IotHubStateInitial  = (): IotHubStateInterface => {
    return {
        sharedAccessSignatureAuthorizationRules: Map<string, LastRetrievedWrapper<SharedAccessSignatureAuthorizationRule[]>>()
    };
};
