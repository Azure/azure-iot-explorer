/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
export interface GetDirectoriesParameters {
    path: string;
}
export interface DirectoryInterface {
    getDirectories(params: GetDirectoriesParameters): Promise<string[]>;
}
