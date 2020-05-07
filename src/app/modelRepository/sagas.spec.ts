/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { takeLatest } from 'redux-saga/effects';
import rootSaga from './sagas';
import { setRepositoryLocationsAction } from './actions';
import { setRepositoryLocationsSaga} from './sagas/setRepositoryLocationsSaga';

describe('modelRepository/saga/rootSaga', () => {
    it('returns specified sagas', () => {
        expect(rootSaga).toEqual([
            takeLatest(setRepositoryLocationsAction, setRepositoryLocationsSaga),
        ]);
    });
});
