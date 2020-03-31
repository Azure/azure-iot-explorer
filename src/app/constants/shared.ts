/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
export const OFFSET_IN_MINUTES = 15;
export const MILLISECONDS_IN_MINUTE = 60000;
export const MILLISECONDS_PER_SECOND = 1000;
export const SECONDS_PER_MINUTE = 60;

export enum AppEnvironment {
    ProdElectron = 'prodElectron',
    ProdHosted = 'ProdHosted',

    DevelopmentElectron = 'developmentElectron',
    DevelopmentHosted = 'developmentHosted'
}
