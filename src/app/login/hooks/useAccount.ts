import { useState } from 'react';
import { msalInstance, executeLoginRedirect, executeLogout, getLoginRedirectError } from '../services/authService';

export interface UseAccountHook {
    login(): void;
    logout(): void;
    accountName: string;
    loginError?: {
        errorCode: string;
        errorMessage: string;
    };
}

export const useAccount = (): UseAccountHook => {
    const account = msalInstance.getAccount();
    const [accountName] = useState<string>(account ? account.name : '');

    const login = () => {
        executeLoginRedirect();
    };

    return {
        accountName,
        login,
        loginError: getLoginRedirectError(),
        logout: executeLogout
    };
};
