import { takeEvery } from 'redux-saga/effects';
import { addConnectionStringAction, deleteConnectionStringAction } from './actions';
import { addConnectionStringSaga } from './sagas/addConnectionStringSaga';
import { deleteConnectionStringSaga } from './sagas/deleteConnectionStringSaga';

export default [
    takeEvery(addConnectionStringAction, addConnectionStringSaga),
    takeEvery(deleteConnectionStringAction, deleteConnectionStringSaga)
];
