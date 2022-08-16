/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
export interface AzureSubscription {
    id: string;
    tenantId: string;
    subscriptionId: string;
    displayName: string;
    state: SubscriptionState;
}

export enum SubscriptionState {
    Deleted = 'Deleted',
    Disabled = 'Disabled',
    Enabled = 'Enabled',
    PastDue = 'PastDue',
    Warned = 'Warned'
}
