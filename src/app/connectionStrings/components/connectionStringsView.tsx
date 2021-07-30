/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { CommandBar } from '@fluentui/react';
import { ConnectionString  } from './connectionString';
import { ConnectionStringEditView } from './connectionStringEditView';
import { ResourceKeys } from '../../../localization/resourceKeys';
import { CONNECTION_STRING_LIST_MAX_LENGTH } from '../../constants/browserStorage';
import { upsertConnectionStringAction, deleteConnectionStringAction, setConnectionStringsAction } from '../actions';
import { ROUTE_PARTS } from '../../constants/routes';
import { formatConnectionStrings, getExpiryDateInUtcString } from '../../shared/utils/hubConnectionStringHelper';
import { ConnectionStringsEmpty } from './connectionStringsEmpty';
import { useAsyncSagaReducer } from '../../shared/hooks/useAsyncSagaReducer';
import { connectionStringsReducer } from '../reducer';
import { connectionStringsSaga } from '../sagas';
import { connectionStringsStateInitial, ConnectionStringWithExpiry } from '../state';
import { SynchronizationStatus } from '../../api/models/synchronizationStatus';
import { MultiLineShimmer } from '../../shared/components/multiLineShimmer';
import { getConnectionInfoFromConnectionString } from '../../api/shared/utils';
import { getConnectionStringsAction } from './../actions';
import { useBreadcrumbEntry } from '../../navigation/hooks/useBreadcrumbEntry';
import { login, logout } from '../../api/services/authenticationService';
import '../../css/_layouts.scss';
import './connectionStringsView.scss';

// tslint:disable-next-line: cyclomatic-complexity
export const ConnectionStringsView: React.FC = () => {
    const { t } = useTranslation();
    const history = useHistory();
    useBreadcrumbEntry({name: t(ResourceKeys.breadcrumb.resources)});

    const [ localState, dispatch ] = useAsyncSagaReducer(connectionStringsReducer, connectionStringsSaga, connectionStringsStateInitial(), 'connectionStringsState');
    const [ connectionStringUnderEdit, setConnectionStringUnderEdit ] = React.useState<string>(undefined);
    const [ temp, setTemp ] = React.useState<string>('have not login');

    const connectionStringsWithExpiry = localState.payload;
    const synchronizationStatus = localState.synchronizationStatus;

    const onUpsertConnectionString = (newConnectionString: string, connectionString: string) => {
        if (newConnectionString !== connectionString) {
            // replacing a connection string with new connection string
            dispatch(deleteConnectionStringAction.started(connectionString));
        }

        const stringWithExpiry: ConnectionStringWithExpiry = {
            connectionString: newConnectionString,
            expiration: getExpiryDateInUtcString()
        };
        dispatch(upsertConnectionStringAction.started(stringWithExpiry));
    };

    const onDeleteConnectionString = (connectionString: string) => {
        dispatch(deleteConnectionStringAction.started(connectionString));
    };

    const onSelectConnectionString = (connectionString: string) => {
        const updatedConnectionStrings = formatConnectionStrings(connectionStringsWithExpiry, connectionString);
        dispatch(setConnectionStringsAction.started(updatedConnectionStrings));
    };

    const onAddConnectionStringClick = () => {
        setConnectionStringUnderEdit('');
    };

    const onEditConnectionStringClick = (connectionString: string) => {
        setConnectionStringUnderEdit(connectionString);
    };

    const onConnectionStringEditCommit = (connectionString: string) => {
        onUpsertConnectionString(connectionString, connectionStringUnderEdit);
        setConnectionStringUnderEdit(undefined);
    };

    const onConnectionStringEditDismiss = () => {
        setConnectionStringUnderEdit(undefined);
    };

    const onLogin = async () => {
        try {
            console.log('connectionStringView calling service.login'); // tslint:disable-line
            const result = await login();
            localStorage.setItem('temp', result.accessToken);
            console.log(result); // tslint:disable-line
            setTemp(result.accessToken);
        }
        catch {
            setTemp('failed to login');
        }
    };

    const onLogout = async () => {
        try {
            console.log('connectionStringView calling service.logout'); // tslint:disable-line
            await logout();
        }
        catch {
            setTemp('failed to logout');
        }
    };

    React.useEffect(() => {
        dispatch(getConnectionStringsAction.started());
    },              []);

    React.useEffect(() => {
        if (synchronizationStatus === SynchronizationStatus.upserted) { // only when connection string updated successfully would navigate to device list view
            const hostName = getConnectionInfoFromConnectionString(connectionStringsWithExpiry[0] && connectionStringsWithExpiry[0].connectionString).hostName;
            history.push(`/${ROUTE_PARTS.IOT_HUB}/${ROUTE_PARTS.HOST_NAME}/${hostName}/`);
        }
    },              [synchronizationStatus]);

    if (synchronizationStatus === SynchronizationStatus.updating || synchronizationStatus === SynchronizationStatus.working) {
        return (
            <MultiLineShimmer/>
        );
    }

    return (
        <div className="view">
            <div className="view-command">
                <CommandBar
                    items={[
                        {
                            ariaLabel: t(ResourceKeys.connectionStrings.addConnectionCommand.ariaLabel),
                            disabled: connectionStringsWithExpiry.length >= CONNECTION_STRING_LIST_MAX_LENGTH,
                            iconProps: { iconName: 'Add' },
                            key: 'add',
                            onClick: onAddConnectionStringClick,
                            text: t(ResourceKeys.connectionStrings.addConnectionCommand.label)
                        },
                        {
                            ariaLabel: t(ResourceKeys.connectionStrings.addConnectionCommand.ariaLabel),
                            disabled: connectionStringsWithExpiry.length >= CONNECTION_STRING_LIST_MAX_LENGTH,
                            iconProps: { iconName: 'Add' },
                            key: 'login',
                            onClick: async () => {await onLogin();}, // tslint:disable-line
                            text: 'login'
                        },
                        {
                            ariaLabel: t(ResourceKeys.connectionStrings.addConnectionCommand.ariaLabel),
                            disabled: connectionStringsWithExpiry.length >= CONNECTION_STRING_LIST_MAX_LENGTH,
                            iconProps: { iconName: 'Add' },
                            key: 'logout',
                            onClick: async () => {await onLogout();}, // tslint:disable-line
                            text: 'logout'
                        }
                    ]}
                />
            </div>
            {temp}
            <div className="view-scroll-vertical">
                <div className="connection-strings">
                    {connectionStringsWithExpiry.map(connectionStringWithExpiry =>
                        <ConnectionString
                            key={connectionStringWithExpiry.connectionString}
                            connectionStringWithExpiry={connectionStringWithExpiry}
                            onEditConnectionString={onEditConnectionStringClick}
                            onDeleteConnectionString={onDeleteConnectionString}
                            onSelectConnectionString={onSelectConnectionString}
                        />
                    )}
                </div>

                {(!connectionStringsWithExpiry || connectionStringsWithExpiry.length === 0) &&
                    <ConnectionStringsEmpty/>
                }

            </div>
            {connectionStringUnderEdit !== undefined &&
                <ConnectionStringEditView
                    connectionStringUnderEdit={connectionStringUnderEdit}
                    connectionStrings={connectionStringsWithExpiry}
                    onDismiss={onConnectionStringEditDismiss}
                    onCommit={onConnectionStringEditCommit}
                />
            }
        </div>
    );
};
