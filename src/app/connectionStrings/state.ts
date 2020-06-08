/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { Record } from 'immutable';
import { CONNECTION_STRING_NAME_LIST } from '../constants/browserStorage';
import { IM } from '../shared/types/types';

export interface ConnectionStringsStateInterface {
    connectionStrings: string[];
}

export type ConnectionStringsStateType = IM<ConnectionStringsStateInterface>;

export const connectionStringsStateInitial = Record<ConnectionStringsStateInterface>({
    connectionStrings: localStorage.getItem(CONNECTION_STRING_NAME_LIST) && localStorage.getItem(CONNECTION_STRING_NAME_LIST).split(',') || []
});
