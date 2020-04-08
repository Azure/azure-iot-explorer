/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';
import { StateInterface } from '../../shared/redux/state';
import { upsertConnectionStringAction, deleteConnectionStringAction, setConnectionStringsAction } from '../actions';
import { setActiveAzureResourceByConnectionStringAction } from '../../azureResource/actions';
import { ROUTE_PARTS } from '../../constants/routes';
import { ConnectionStringsView } from './connectionStringsView';
import { formatConnectionStrings } from '../../shared/utils/hubConnectionStringHelper';

export const ConnectionStringsViewContainer: React.FC<RouteComponentProps> = props => {
    const connectionStrings = useSelector((state: StateInterface) => state.connectionStringsState.connectionStrings);
    const dispatch = useDispatch();

    const onUpsertConnectionString = (newConnectionString: string, connectionString?: string) => {
        dispatch(upsertConnectionStringAction({newConnectionString, connectionString}));
    };

    const onDeleteConnectionString = (connectionString: string) => {
        dispatch(deleteConnectionStringAction(connectionString));
    };

    const onSelectConnectionString = (connectionString: string, hostName: string) => {
        const updatedConnectionStrings = formatConnectionStrings(connectionStrings, connectionString);

        dispatch(setConnectionStringsAction(updatedConnectionStrings));
        dispatch(setActiveAzureResourceByConnectionStringAction({
            connectionString,
            hostName
        }));

        props.history.push(`/${ROUTE_PARTS.RESOURCE}/${hostName}/${ROUTE_PARTS.DEVICES}`);
    };

    return (
        <ConnectionStringsView
            onUpsertConnectionString={onUpsertConnectionString}
            onDeleteConnectionString={onDeleteConnectionString}
            onSelectConnectionString={onSelectConnectionString}
            connectionStrings={connectionStrings}
        />
    );
};
