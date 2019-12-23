/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { takeEvery } from 'redux-saga/effects';
import { addConnectionStringAction, deleteConnectionStringAction } from './actions';
import { addConnectionStringSaga } from './sagas/addConnectionStringSaga';
import { deleteConnectionStringSaga } from './sagas/deleteConnectionStringSaga';

export default [
    takeEvery(addConnectionStringAction, addConnectionStringSaga),
    takeEvery(deleteConnectionStringAction, deleteConnectionStringSaga)
];
