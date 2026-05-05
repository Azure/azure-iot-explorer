/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { IotHubDescription } from '../../api/models/iotHubDescription';
import { AzureSubscription } from '../../api/models/azureSubscription';
import { AzureTenant } from '../../api/models/azureTenant';
export interface AzureActiveDirectoryStateInterface {
    formState: 'initialized' | 'working' | 'failed' | 'idle' | 'keyPicked';
    iotHubKey: string;
    iotHubs: IotHubDescription[];
    subscriptions: AzureSubscription[];
    tenants: AzureTenant[];
    selectedTenantId: string;
    token: string;
}

export const getInitialAzureActiveDirectoryState = (): AzureActiveDirectoryStateInterface => ({
    formState: 'initialized',
    iotHubKey: undefined,
    iotHubs: [],
    subscriptions: [],
    tenants: [],
    selectedTenantId: undefined,
    token: undefined
});
