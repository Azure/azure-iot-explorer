/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { takeEvery } from 'redux-saga/effects';
import { addNotificationAction } from './actions';
import { addNotificationSaga } from './sagas/addNotificationSaga';

export default [
    takeEvery(addNotificationAction.started.type, addNotificationSaga)
];
