/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { takeEvery } from 'redux-saga/effects';
import saga from './sagas';
import { addNotificationSaga } from './sagas/addNotificationSaga';

describe('notifications/saga', () => {
    it('returns expected saga', () => {
        expect(saga).toEqual([
            takeEvery('NOTIFICATIONS/ADD_STARTED', addNotificationSaga)
        ]);
    });
});
