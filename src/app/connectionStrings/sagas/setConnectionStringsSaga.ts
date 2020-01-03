/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { call } from 'redux-saga/effects';
import { Action } from 'typescript-fsa';
import { CONNECTION_STRING_NAME_LIST } from '../../constants/browserStorage';

export function* setConnectionStringsSaga(action: Action<string[]>) {
    yield call(setConnectionStrings, action.payload.join(','));
}

export const getConnectionStrings = (): string => {
    return localStorage.getItem(CONNECTION_STRING_NAME_LIST);
};

export const setConnectionStrings = (value: string): void => {
    return localStorage.setItem(CONNECTION_STRING_NAME_LIST, value);
};
