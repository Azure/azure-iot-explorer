/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { reducerWithInitialState } from 'typescript-fsa-reducers';
import { ConnectionStateType, connectionStateInitial } from './state';
import { setConnectionStringAction, SetConnectionStringActionParameter } from './actions';
import { CONNECTION_STRING_NAME_LIST, REMEMBER_CONNECTION_STRING, CONNECTION_STRING_LIST_MAX_LENGTH } from '../constants/browserStorage';

const reducer = reducerWithInitialState<ConnectionStateType>(connectionStateInitial())
    .case(setConnectionStringAction, (state: ConnectionStateType, payload: SetConnectionStringActionParameter) => {
        localStorage.setItem(REMEMBER_CONNECTION_STRING, payload.rememberConnectionString.toString());
        if (payload.rememberConnectionString) {
            // save connection string to local storage with a max length of ${CONNECTION_STRING_LIST_MAX_LENGTH}
            const savedStrings = localStorage.getItem(CONNECTION_STRING_NAME_LIST);
            if (savedStrings) {
                const savedNames = savedStrings.split(',').filter(name => name !== payload.connectionString); // remove duplicates
                const updatedNames = [payload.connectionString, ...savedNames].slice(0, CONNECTION_STRING_LIST_MAX_LENGTH);
                localStorage.setItem(CONNECTION_STRING_NAME_LIST, updatedNames.join(','));
            }
            else {
                localStorage.setItem(CONNECTION_STRING_NAME_LIST, payload.connectionString);
            }
        }
        else {
            localStorage.setItem(CONNECTION_STRING_NAME_LIST, '');
        }

        return state.merge({
            connectionString: payload.connectionString,
            rememberConnectionString: payload.rememberConnectionString
        });
    });
export default reducer;
