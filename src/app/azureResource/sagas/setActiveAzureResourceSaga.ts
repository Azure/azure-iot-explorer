/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { Action } from 'typescript-fsa';
import { call } from 'redux-saga/effects';
import { AzureResource } from '../models/azureResource';
import { ACTIVE_CONNECTION_STRING } from '../../constants/browserStorage';

export function* setActiveAzureResourceSaga(action: Action<AzureResource>) {
    yield call(setActiveConnectionString, action.payload.connectionString);
}

// note(asrudra): storing active connection string in local storage for now. Will keep it in memory with glo balContext or singleton class in next iteration
export const setActiveConnectionString = (value: string): void => {
    return localStorage.setItem(ACTIVE_CONNECTION_STRING, value);
};
