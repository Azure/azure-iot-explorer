/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { StateType } from '../shared/redux/state';
import { CONNECTION_STRING_NAME_LIST } from './../constants/browserStorage';

export const getConnectionStringSelector = (state: StateType) => {
    return state && state.connectionState && state.connectionState.connectionString;
};

export const getRememberConnectionStringValueSelector = (state: StateType) => {
    return state && state.connectionState && state.connectionState.rememberConnectionString;
};

export const getConnectionStringListSelector = () => {
    return localStorage.getItem(CONNECTION_STRING_NAME_LIST) && localStorage.getItem(CONNECTION_STRING_NAME_LIST).split(',');
};
