/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { AuthenticationResult } from '../../../../public/interfaces/authenticationInterface';
import { getAuthenticationInterface } from '../shared/interfaceUtils';

export const login = async (): Promise<AuthenticationResult> => {
    console.log('authenticationService calling api.login'); // tslint:disable-line
    const api = getAuthenticationInterface();
    const result = await api.login();
    localStorage.setItem('authenticationService_temp', result.accessToken);
    console.log(result); // tslint:disable-line
    return result;
};

export const logout = async (): Promise<void> => {
    console.log('authenticationService calling api.logout'); // tslint:disable-line
    const api = getAuthenticationInterface();
    return api.logout();
};
