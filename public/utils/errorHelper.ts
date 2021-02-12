/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
export interface ContextBridgeError<T> extends Error {
    data: T;
}

// tslint:disable-next-line: no-any
export const formatError = (error: Error): ContextBridgeError<any> => {
    return {name: error.name, message: error.message, data: {...error}};
};
