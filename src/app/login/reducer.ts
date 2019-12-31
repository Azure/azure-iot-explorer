/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { reducerWithInitialState } from 'typescript-fsa-reducers';
import { ConnectionStateType, connectionStateInitial } from './state';
import { setConnectionStringAction, SetConnectionStringActionParameter } from './actions';
import { CONNECTION_STRING_NAME_LIST, CONNECTION_STRING_LIST_MAX_LENGTH } from '../constants/browserStorage';

const reducer = reducerWithInitialState<ConnectionStateType>(connectionStateInitial())
    .case(setConnectionStringAction, (state: ConnectionStateType, payload: SetConnectionStringActionParameter) => {
        // save connection string to local storage with a max length of ${CONNECTION_STRING_LIST_MAX_LENGTH}
        if (payload && payload.connectionStringList) {
            const recentItems = payload.connectionStringList.slice(0, CONNECTION_STRING_LIST_MAX_LENGTH);
            const connectionStringList = payload.connectionStringList.filter(s => s !== payload.connectionString);
            connectionStringList.unshift(payload.connectionString);

            localStorage.setItem(CONNECTION_STRING_NAME_LIST, connectionStringList.join(','));
        }
        else {
            localStorage.setItem(CONNECTION_STRING_NAME_LIST, payload.connectionString);
        }

        return state.merge({
            connectionString: payload.connectionString,
        });
    });
export default reducer;
