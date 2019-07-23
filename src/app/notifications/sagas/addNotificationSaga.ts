/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { Action } from 'typescript-fsa';
import { call, put } from 'redux-saga/effects';
import { Notification } from '../../api/models/notification';
import { addNotificationAction } from '../actions';
import { raiseNotificationToast } from '../components/notificationToast';

export function* addNotificationSaga(action: Action<Notification>) {

    if (!action.payload.issued) {
        action.payload.issued = yield call(Date);
    }

    yield put(addNotificationAction.done({params: action.payload, result: action.payload}));
    yield call(raiseNotificationToast, action.payload);
}
