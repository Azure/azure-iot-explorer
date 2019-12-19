/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { CONNECTION_STRING_NAME_LIST, REMEMBER_CONNECTION_STRING } from '../constants/browserStorage';

export interface ConnectionStringsStateInterface {
    connectionStrings: string[];
}

export const connectionStringsStateInitial  = (): ConnectionStringsStateInterface => {
    return {
        connectionStrings: localStorage.getItem(CONNECTION_STRING_NAME_LIST) && localStorage.getItem(CONNECTION_STRING_NAME_LIST).split(',') || [],
    };
};
