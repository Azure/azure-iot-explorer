/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { Record } from 'immutable';
import { CONNECTION_STRING_NAME_LIST } from '../constants/browserStorage';
import { IM } from '../shared/types/types';

export interface ConnectionStateInterface {
    connectionString: string;
}

export const connectionStateInitial = Record<ConnectionStateInterface>({
    connectionString: localStorage.getItem(CONNECTION_STRING_NAME_LIST) && localStorage.getItem(CONNECTION_STRING_NAME_LIST).split(',')[0] || '',
});

export type ConnectionStateType = IM<ConnectionStateInterface>;
