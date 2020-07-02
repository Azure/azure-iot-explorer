/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { takeLatest, all, takeEvery } from 'redux-saga/effects';
import { setRepositoryLocationsAction } from './actions';
import { setRepositoryLocationsSaga } from './sagas/setRepositoryLocationsSaga';
import { loggerSaga } from '../appTelemetry/appTelemetrySaga';

export function* globalSaga() {
    yield all([
        takeLatest(setRepositoryLocationsAction, setRepositoryLocationsSaga),
        takeEvery('*', loggerSaga)
    ]);
}
