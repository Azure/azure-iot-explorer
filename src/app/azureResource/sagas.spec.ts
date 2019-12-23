/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { takeLatest } from 'redux-saga/effects';
import rootSaga from './sagas';
import { setActiveAzureResourceByConnectionStringAction, setActiveAzureResourceByHostNameAction, setActiveAzureResourceAction } from './actions';
import { setActiveAzureResourceByConnectionStringSaga } from './sagas/setActiveAzureResourceByConnectionStringSaga';
import { setActiveAzureResourceByHostNameSaga } from './sagas/setActiveAzureResourceByHostNameSaga';
import { setActiveAzureResourceSaga } from './sagas/setActiveAzureResourceSaga';

describe('connectionStrings/saga/rootSaga', () => {
    it('returns specified sagas', () => {
        expect(rootSaga).toEqual([
            takeLatest(setActiveAzureResourceByConnectionStringAction, setActiveAzureResourceByConnectionStringSaga),
            takeLatest(setActiveAzureResourceByHostNameAction, setActiveAzureResourceByHostNameSaga),
            takeLatest(setActiveAzureResourceAction, setActiveAzureResourceSaga)
        ]);
    });
});
