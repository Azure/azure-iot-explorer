/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { IotHubDescription } from '../../api/models/iotHubDescription';
import { AzureSubscription } from '../../api/models/azureSubscription';
export interface AzureActiveDirectoryStateInterface {
    formState: 'initialized' | 'working' | 'failed' | 'idle' | 'keyPicked';
    iotHubKey: string;
    iotHubs: IotHubDescription[];
    subscriptions: AzureSubscription[];
    token: string;
}

export const getInitialAzureActiveDirectoryState = (): AzureActiveDirectoryStateInterface => ({
    formState: 'initialized',
    iotHubKey: undefined,
    iotHubs: [],
    subscriptions: [],
    token: undefined
});
