/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
export enum SYNC_STATUS {
    Failed,
    None,
    Synced,
    Syncing
}

export enum DesiredStateStatus{
    Success = 200,
    Synching = 202,
    Error = 500
}

export const MILLISECONDS_IN_MINUTE = 60000;
export const PUBLIC_REPO_HOSTNAME = 'repo.azureiotrepository.com';

export enum AppEnvironment {
    ProdElectron = 'prodElectron',
    ProdHosted = 'ProdHosted',

    DevelopmentElectron = 'developmentElectron',
    DevelopmentHosted = 'developmentHosted'
}
