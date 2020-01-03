/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { call } from 'redux-saga/effects';
import { Action } from 'typescript-fsa';
import { setConnectionStrings } from './addConnectionStringSaga';

export function* setConnectionStringsSaga(action: Action<string[]>) {
    yield call(setConnectionStrings, action.payload.join(','));
}
