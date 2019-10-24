/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { StateInterface } from '../shared/redux/state';
import { CONNECTION_STRING_NAME_LIST } from '../constants/browserStorage';

export const getConnectionStringSelector = (state: StateInterface) => {
    return state && state.connectionState && state.connectionState.connectionString;
};

export const getRememberConnectionStringValueSelector = (state: StateInterface) => {
    return state && state.connectionState && state.connectionState.rememberConnectionString;
};

export const getConnectionStringListSelector = (state: StateInterface) => {
    return getRememberConnectionStringValueSelector(state) ?
        localStorage.getItem(CONNECTION_STRING_NAME_LIST) && localStorage.getItem(CONNECTION_STRING_NAME_LIST).split(',') :
        (getConnectionStringSelector(state) ? [getConnectionStringSelector(state)] : undefined); // if connection string is not saved in local storage, check if one connection string is saved in state
};
