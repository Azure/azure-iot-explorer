/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { getAuthenticationInterface } from '../shared/interfaceUtils';

export const login = async (): Promise<void> => {
    const api = getAuthenticationInterface();
    return api.login();
};

export const logout = async (): Promise<void> => {
    const api = getAuthenticationInterface();
    return api.logout();
};

export const getProfileToken = async (): Promise<string> => {
    const api = getAuthenticationInterface();
    return api.getProfileToken();
};
