/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { reducerWithInitialState } from 'typescript-fsa-reducers';
import { ConnectionStateType, connectionStateInitial } from './state';
import { setConnectionStringAction, SetConnectionStringActionParameter } from './actions';
import { CONNECTION_STRING_NAME, REMEMBER_CONNECTION_STRING } from '../constants/browserStorage';

const reducer = reducerWithInitialState<ConnectionStateType>(connectionStateInitial())
    .case(setConnectionStringAction, (state: ConnectionStateType, payload: SetConnectionStringActionParameter) => {
        localStorage.setItem(REMEMBER_CONNECTION_STRING, payload.rememberConnectionString.toString());
        if (payload.rememberConnectionString) {
            localStorage.setItem(CONNECTION_STRING_NAME, payload.connectionString || '');
        }
        else {
            localStorage.setItem(CONNECTION_STRING_NAME, '');
        }
        return state.merge({
            connectionString: payload.connectionString,
            rememberConnectionString: payload.rememberConnectionString
        });
    });
export default reducer;
