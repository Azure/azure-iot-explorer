/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { StateType } from '../shared/redux/state';

export const getConnectionStringSelector = (state: StateType) => {
    return state && state.connectionState && state.connectionState.connectionString;
};

export const getRememberConnectionStringValueSelector = (state: StateType) => {
    return state && state.connectionState && state.connectionState.rememberConnectionString;
};
