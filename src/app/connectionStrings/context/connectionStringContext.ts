import * as React from 'react';

export interface ConnectionStringOpsInterface {
    setConnectionString: (connectionString: string) => void;
}

export interface ConnectionStringStateInterface {
    connectionString: string;
}

export type ConnectionStringType = [ConnectionStringStateInterface, ConnectionStringOpsInterface];

export const ConnectionStringContext = React.createContext<ConnectionStringType>
    ([
        {connectionString: ''},
        {setConnectionString: () => undefined}
    ]);
export const useConnectionStringContext = () => React.useContext(ConnectionStringContext);
