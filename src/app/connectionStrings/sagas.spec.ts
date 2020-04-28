/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { takeEvery, takeLatest } from 'redux-saga/effects';
import rootSaga from './sagas';
import { addConnectionStringAction, deleteConnectionStringAction, setConnectionStringsAction, upsertConnectionStringAction } from './actions';
import { addConnectionStringSaga } from './sagas/addConnectionStringSaga';
import { deleteConnectionStringSaga } from './sagas/deleteConnectionStringSaga';
import { setConnectionStringsSaga } from './sagas/setConnectionStringsSaga';
import { upsertConnectionStringSaga } from './sagas/upsertConnectionStringSaga';

describe('connectionStrings/saga/rootSaga', () => {
    it('returns specified sagas', () => {
        expect(rootSaga).toEqual([
            takeEvery(addConnectionStringAction, addConnectionStringSaga),
            takeEvery(deleteConnectionStringAction, deleteConnectionStringSaga),
            takeLatest(setConnectionStringsAction, setConnectionStringsSaga),
            takeEvery(upsertConnectionStringAction, upsertConnectionStringSaga)
        ]);
    });
});
