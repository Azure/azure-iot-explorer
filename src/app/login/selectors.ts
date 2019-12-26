/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { createSelector } from 'reselect';
import { CONNECTION_STRING_NAME_LIST } from '../constants/browserStorage';

export const getConnectionStringListSelector = () => {
    const list = localStorage.getItem(CONNECTION_STRING_NAME_LIST);
    return (list && list.split(',')) || [];
};

export const getConnectionStringSelector = createSelector(
    getConnectionStringListSelector,
    list =>
    list && list[0]
);
