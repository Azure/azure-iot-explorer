/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { Map } from 'immutable';
import { SharedAccessSignatureAuthorizationRule } from './models/sharedAccessSignatureAuthorizationRule';
import { CacheWrapper } from '../api/models/cacheWrapper';

export interface IotHubStateInterface {
     sharedAccessSignatureAuthorizationRules: Map<string, CacheWrapper<SharedAccessSignatureAuthorizationRule[]>>;
}

export const iotHubStateInitial  = (): IotHubStateInterface => {
    return {
        sharedAccessSignatureAuthorizationRules: Map<string, CacheWrapper<SharedAccessSignatureAuthorizationRule[]>>()
    };
};
