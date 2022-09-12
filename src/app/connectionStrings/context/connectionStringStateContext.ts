import * as React from 'react';
import { connectionStringsStateInitial, ConnectionStringsStateType } from '../state';
import {  ConnectionStringInterface } from './connectionStringStateProvider';

export const getInitialConnectionStringOps = (): ConnectionStringInterface => ({
    deleteConnectionString: () => undefined,
    getConnectionStrings: () => undefined,
    setConnectionStrings: () => undefined,
    upsertConnectionString: () => undefined,
});

export const ConnectionStringStateContext = React.createContext<[ConnectionStringsStateType, ConnectionStringInterface]>
    ([
        connectionStringsStateInitial(),
        getInitialConnectionStringOps()
    ]);
export const useConnectionStringContext = () => React.useContext(ConnectionStringStateContext);
