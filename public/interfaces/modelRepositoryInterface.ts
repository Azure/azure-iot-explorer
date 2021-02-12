/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
export const MODEL_PARSE_ERROR = 'modelParseError';
export interface ModelParseErrorData {
    fileNames: string[];
}

export interface GetDirectoriesParameters {
    path: string;
}
export interface GetInterfaceDefinitionParameters {
    interfaceId: string;
    path: string;
}
export interface ModelRepositoryInterface {
    getInterfaceDefinition(params: GetInterfaceDefinitionParameters): Promise<object | undefined>;
}
