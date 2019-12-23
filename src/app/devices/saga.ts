/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { all } from 'redux-saga/effects';
import deviceListSagas from './deviceList/sagas';
import deviceContentSagas from './deviceContent/sagas';
import notificationsSagas from '../notifications/sagas';
import connectionStringsSagas from '../connectionStrings/sagas';
import azureResourceSagas from '../azureResource/sagas';

export default function* rootSaga() {
    yield all([
        ...azureResourceSagas,
        ...connectionStringsSagas,
        ...deviceListSagas,
        ...deviceContentSagas,
        ...notificationsSagas,
    ]);
}
