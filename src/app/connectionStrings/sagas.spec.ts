/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { takeEvery, takeLatest, all } from 'redux-saga/effects';
import { connectionStringsSaga } from './sagas';
import { deleteConnectionStringAction, setConnectionStringsAction, upsertConnectionStringAction, getConnectionStringsAction } from './actions';
import { deleteConnectionStringSaga } from './sagas/deleteConnectionStringSaga';
import { setConnectionStringsSaga } from './sagas/setConnectionStringsSaga';
import { upsertConnectionStringSaga } from './sagas/upsertConnectionStringSaga';
import { getConnectionStringsSaga } from './sagas/getConnectionStringsSaga';

describe('connectionStrings/saga/rootSaga', () => {
    it('returns specified sagas', () => {
        expect(connectionStringsSaga().next().value).toEqual(all([
            takeLatest(getConnectionStringsAction.started.type, getConnectionStringsSaga),
            takeEvery(deleteConnectionStringAction.started.type, deleteConnectionStringSaga),
            takeLatest(setConnectionStringsAction.started.type, setConnectionStringsSaga),
            takeEvery(upsertConnectionStringAction.started.type, upsertConnectionStringSaga)
        ]));
    });
});
