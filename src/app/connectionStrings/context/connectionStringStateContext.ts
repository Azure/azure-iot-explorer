import * as React from 'react';
import { connectionStringsStateInitial, ConnectionStringsStateType } from '../state';
import { AuthenticationInterface } from './connectionStringStateProvider';

export const getInitialConnectionStringOps = (): AuthenticationInterface => ({
    deleteConnectionString: () => undefined,
    getConnectionStrings: () => undefined,
    setConnectionStrings: () => undefined,
    upsertConnectionString: () => undefined,
});

export const ConnectionStringStateContext = React.createContext<[ConnectionStringsStateType, AuthenticationInterface]>
    ([
        connectionStringsStateInitial(),
        getInitialConnectionStringOps()
    ]);
export const useConnectionStringContext = () => React.useContext(ConnectionStringStateContext);
