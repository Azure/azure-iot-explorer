/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
 export interface GetProtoFilesParameters {
    path: string;
}

export interface LoadProtoFileParameters {
    path: string;
}
export interface ProtoFileInterface {
    getProtoFiles(params: GetProtoFilesParameters): Promise<string[]>;
    loadProtoFile(params: LoadProtoFileParameters): void;
}
