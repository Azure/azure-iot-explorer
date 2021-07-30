/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { getAuthenticationInterface } from '../shared/interfaceUtils';

export const login = async (): Promise<void> => {  // to be called from UI
    const api = getAuthenticationInterface();
    await api.login();
};
