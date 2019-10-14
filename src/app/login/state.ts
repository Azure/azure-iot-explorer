/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { Record } from 'immutable';
import { CONNECTION_STRING_NAME_LIST, REMEMBER_CONNECTION_STRING } from '../constants/browserStorage';
import { IM } from '../shared/types/types';

export interface ConnectionStateInterface {
    connectionString: string;
    rememberConnectionString: boolean;
}

export const connectionStateInitial = Record<ConnectionStateInterface>({
    connectionString: localStorage.getItem(CONNECTION_STRING_NAME_LIST) && localStorage.getItem(CONNECTION_STRING_NAME_LIST).split(',')[0] || '',
    rememberConnectionString: localStorage.getItem(REMEMBER_CONNECTION_STRING) === 'true'
});

export type ConnectionStateType = IM<ConnectionStateInterface>;
