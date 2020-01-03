/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { call } from 'redux-saga/effects';
import { Action } from 'typescript-fsa';
import { getConnectionStrings, setConnectionStrings } from './setConnectionStringsSaga';

export function* deleteConnectionStringSaga(action: Action<string>) {
    const savedStrings: string = yield call(getConnectionStrings);

    if (savedStrings) {
        const savedNames = savedStrings.split(',').filter(name => name !== action.payload); // remove duplicates
        const updatedNames = savedNames.filter(s => s !== action.payload);
        yield call(setConnectionStrings, updatedNames.join(','));
    }
}
