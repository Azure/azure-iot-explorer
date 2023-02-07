/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { takeLatest } from 'redux-saga/effects';
import { setRepositoryLocationsAction } from './actions';
import { setRepositoryLocationsSaga } from './sagas/setRepositoryLocationsSaga';

export function* modelRepositorySaga() {
    yield takeLatest(setRepositoryLocationsAction.started, setRepositoryLocationsSaga);
}
