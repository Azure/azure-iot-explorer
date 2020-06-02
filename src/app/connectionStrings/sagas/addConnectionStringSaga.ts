/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { call } from 'redux-saga/effects';
import { Action } from 'typescript-fsa';
import { CONNECTION_STRING_LIST_MAX_LENGTH } from '../../constants/browserStorage';
import { getConnectionStrings, setConnectionStrings } from './setConnectionStringsSaga';

export function* addConnectionStringSaga(action: Action<string>) {
    const savedStrings: string = yield call(getConnectionStrings);
    let updatedValue: string;

    if (savedStrings) {
        const savedNames = savedStrings.split(',').filter(name => name !== action.payload); // remove duplicates
        const updatedNames = [action.payload, ...savedNames].slice(0, CONNECTION_STRING_LIST_MAX_LENGTH);
        updatedValue = updatedNames.join(',');
    }
    else {
        updatedValue = action.payload;
    }

    yield call(setConnectionStrings, updatedValue);
}
