import * as React from 'react';
import { connectionStringsStateInitial, ConnectionStringWithExpiry } from '../state';
import { connectionStringsReducer } from '../reducer';
import { connectionStringsSaga } from '../sagas';
import { useAsyncSagaReducer } from '../../shared/hooks/useAsyncSagaReducer';
import { ConnectionStringStateContext } from './connectionStringStateContext';
import { deleteConnectionStringAction, getConnectionStringsAction, setConnectionStringsAction, upsertConnectionStringAction } from '../actions';

export interface ConnectionStringInterface {
    getConnectionStrings(): void;
    setConnectionStrings(connectionStringInfoList: ConnectionStringWithExpiry[]): void;
    upsertConnectionString(connectionStringInfo: ConnectionStringWithExpiry): void;
    deleteConnectionString(connectionString: string): void;
}

export const ConnectionStringStateContextProvider: React.FC = props => {
    const [ state, dispatch ] = useAsyncSagaReducer(connectionStringsReducer, connectionStringsSaga, connectionStringsStateInitial(), 'connectionStringsState');

    const connectionStringApi: ConnectionStringInterface = {
        deleteConnectionString: (connectionString: string) => dispatch(deleteConnectionStringAction.started(connectionString)),
        getConnectionStrings: () => dispatch(getConnectionStringsAction.started()),
        setConnectionStrings: (connectionStringInfoList: ConnectionStringWithExpiry[]) => dispatch(setConnectionStringsAction.started(connectionStringInfoList)),
        upsertConnectionString: (connectionStringInfo: ConnectionStringWithExpiry) => dispatch(upsertConnectionStringAction.started(connectionStringInfo)),
    };

    return (
        <ConnectionStringStateContext.Provider value={[state, connectionStringApi]}>
            {props.children}
        </ConnectionStringStateContext.Provider>
    );
};
