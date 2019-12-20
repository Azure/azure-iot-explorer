/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { SharedAccessSignatureAuthorizationRule } from '../models/sharedAccessSignatureAuthorizationRule';

export interface GetAuthorizedSubscriptionIdsParameters {
    authorizationToken: string;
    managementEndpoint: string;
}
export const GetAuthorizedSubscriptionIds = async (parameters: GetAuthorizedSubscriptionIdsParameters): Promise<string[]> => {
    throw new Error('not implemented');
};

export interface GetResourceIdParameters {
    authorizationToken: string;
    managementEndpoint: string;
    resourceName: string;
    resourceType: string;
}
export const GetResourceId = async (parameters: GetResourceIdParameters): Promise<string> => {
    throw new Error('not implemented');
};

export interface GetSharedAccessSignatureAuthorizationRuleParameters {
    authorizationToken: string;
    managementEndpoint: string;
    resourceId: string;
}
export const GetSharedAccessSignatureRules = async (parameters: GetSharedAccessSignatureAuthorizationRuleParameters): Promise<SharedAccessSignatureAuthorizationRule> => {
    throw new Error('not implemented');
};
