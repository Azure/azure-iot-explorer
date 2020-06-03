/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { all } from 'redux-saga/effects';
import deviceContentSagas from './deviceContent/sagas';
import connectionStringsSagas from '../connectionStrings/sagas';
import modelRepositorySagas from '../modelRepository/sagas';
import azureResourceSagas from '../azureResource/sagas';
import moduleSaga from './module/sagas';

export default function* rootSaga() {
    yield all([
        ...azureResourceSagas,
        ...connectionStringsSagas,
        ...deviceContentSagas,
        ...modelRepositorySagas,
        ...moduleSaga
    ]);
}
