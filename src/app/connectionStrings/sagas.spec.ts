/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { takeEvery } from 'redux-saga/effects';
import rootSaga from './sagas';
import { addConnectionStringAction, deleteConnectionStringAction } from './actions';
import { addConnectionStringSaga } from './sagas/addConnectionStringSaga';
import { deleteConnectionStringSaga } from './sagas/deleteConnectionStringSaga';

describe('connectionStrings/saga/rootSaga', () => {
    it('returns specified sagas', () => {
        expect(rootSaga).toEqual([
            takeEvery(addConnectionStringAction, addConnectionStringSaga),
            takeEvery(deleteConnectionStringAction, deleteConnectionStringSaga),
        ]);
    });
});
