/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
export enum IotHubMode {
    uninitialized,
    fetching,
    fetchingFailed,
    idle
}

export interface IotHubState {
    iotHubMode: IotHubMode;
}

export const getInitialIotHubState = (): IotHubState => {
    return {
        iotHubMode: IotHubMode.uninitialized
    };
};
