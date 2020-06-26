/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { takeEvery, takeLatest, all } from 'redux-saga/effects';
import { getConnectionStringAction, deleteConnectionStringAction, setConnectionStringsAction, upsertConnectionStringAction } from './actions';
import { getConnectionStringsSaga } from './sagas/getConnectionStringsSaga';
import { deleteConnectionStringSaga } from './sagas/deleteConnectionStringSaga';
import { setConnectionStringsSaga } from './sagas/setConnectionStringsSaga';
import { upsertConnectionStringSaga } from './sagas/upsertConnectionStringSaga';

export function* connectionStringsSaga() {
    yield all([
        takeLatest(getConnectionStringAction.started.type, getConnectionStringsSaga),
        takeEvery(deleteConnectionStringAction.started.type, deleteConnectionStringSaga),
        takeLatest(setConnectionStringsAction.started.type, setConnectionStringsSaga),
        takeEvery(upsertConnectionStringAction.started.type, upsertConnectionStringSaga)
    ]);
}
