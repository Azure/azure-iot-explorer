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
import { useAuthenticationState } from '../../shared/authentication/hooks/authenticationStateHook';
import '../../css/_layouts.scss';
import './connectionStringsView.scss';

// tslint:disable-next-line: cyclomatic-complexity
export const ConnectionStringsView: React.FC = () => {
    const { t } = useTranslation();
    const history = useHistory();
    useBreadcrumbEntry({name: t(ResourceKeys.breadcrumb.resources)});
    const [ {token} , {getToken, login, logout}] = useAuthenticationState();

    const [ localState, dispatch ] = useAsyncSagaReducer(connectionStringsReducer, connectionStringsSaga, connectionStringsStateInitial(), 'connectionStringsState');
    const [ connectionStringUnderEdit, setConnectionStringUnderEdit ] = React.useState<string>(undefined);

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

    React.useEffect(() => {
        dispatch(getConnectionStringsAction.started());
        getToken();
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

    const getCommandBarItems = () => {
        const items = [{
                ariaLabel: t(ResourceKeys.connectionStrings.addConnectionCommand.ariaLabel),
                disabled: connectionStringsWithExpiry.length >= CONNECTION_STRING_LIST_MAX_LENGTH,
                iconProps: { iconName: 'Add' },
                key: 'add',
                onClick: onAddConnectionStringClick,
                text: t(ResourceKeys.connectionStrings.addConnectionCommand.label)
        }];
        return !token ? [...items, {
                ariaLabel: t(ResourceKeys.authentication.command.login),
                iconProps: { iconName: 'Signin' },
                key: 'signin',
                onClick: login,
                text: t(ResourceKeys.authentication.command.login)
            }] :
            [...items, {
                ariaLabel: t(ResourceKeys.authentication.command.logout),
                iconProps: { iconName: 'Signout' },
                key: 'signout',
                onClick: logout,
                text: t(ResourceKeys.authentication.command.logout)
            }];
    };

    return (
        <div className="view">
            <div className="view-command">
                <CommandBar
                    items={getCommandBarItems()}
                />
            </div>
            <div className="view-scroll-vertical">
                {token}
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
