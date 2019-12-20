/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { StateInterface } from '../shared/redux/state';
import { CONNECTION_STRING_NAME_LIST } from '../constants/browserStorage';

export const getConnectionStringSelector = (state: StateInterface) => {
    return state && state.connectionState && state.connectionState.connectionString;
};

export const getConnectionStringListSelector = () => {
    const list = localStorage.getItem(CONNECTION_STRING_NAME_LIST);
    return (list && list.split(',')) || [];
};
