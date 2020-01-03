/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { reducerWithInitialState } from 'typescript-fsa-reducers';
import { addConnectionStringAction, deleteConnectionStringAction, setConnectionStringsAction } from './actions';
import { connectionStringsStateInitial, ConnectionStringsStateInterface } from './state';

const reducer = reducerWithInitialState<ConnectionStringsStateInterface>(connectionStringsStateInitial())
    .case(addConnectionStringAction, (state: ConnectionStringsStateInterface, payload: string) => {
        const updatedState = {...state};
        updatedState.connectionStrings = updatedState.connectionStrings.filter(s => s !== payload);
        updatedState.connectionStrings.push(payload);
        return updatedState;
    })

    .case(deleteConnectionStringAction, (state: ConnectionStringsStateInterface, payload: string) => {
        const updatedState = {...state};
        updatedState.connectionStrings = state.connectionStrings.filter(s => s !== payload);
        return updatedState;
    })

    .case(setConnectionStringsAction, (state: ConnectionStringsStateInterface, payload: string[]) => {
        const updatedState = {...state};
        updatedState.connectionStrings = payload;
        return updatedState;
    });

export default reducer;
