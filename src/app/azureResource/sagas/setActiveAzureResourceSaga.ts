/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { Action } from 'typescript-fsa';
import { call, put } from 'redux-saga/effects';
import { AzureResource } from '../models/azureResource';
import { clearModelDefinitionsAction } from '../../devices/deviceContent/actions';
import { ACTIVE_CONNECTION_STRING } from '../../constants/browserStorage';

export function* setActiveAzureResourceSaga(action: Action<AzureResource>) {
    yield call(setActiveConnectionString, action.payload.connectionString);
    yield put(clearModelDefinitionsAction());
}

// note(asrudra): storing active connection string in local storage for now. Will keep it in memory with glo balContext or singleton class in next iteration
export const setActiveConnectionString = (value: string): void => {
    return localStorage.setItem(ACTIVE_CONNECTION_STRING, value);
};
