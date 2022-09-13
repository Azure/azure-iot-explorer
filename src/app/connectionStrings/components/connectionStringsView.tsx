/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { ConnectionString  } from './connectionString';
import { ConnectionStringEditView } from './connectionStringEditView';
import { ResourceKeys } from '../../../localization/resourceKeys';
import { ROUTE_PARTS } from '../../constants/routes';
import { formatConnectionStrings, getExpiryDateInUtcString } from '../../shared/utils/hubConnectionStringHelper';
import { ConnectionStringsEmpty } from './connectionStringsEmpty';
import {  ConnectionStringWithExpiry } from '../state';
import { SynchronizationStatus } from '../../api/models/synchronizationStatus';
import { MultiLineShimmer } from '../../shared/components/multiLineShimmer';
import { getConnectionInfoFromConnectionString } from '../../api/shared/utils';
import { useBreadcrumbEntry } from '../../navigation/hooks/useBreadcrumbEntry';
import { AppInsightsClient } from '../../shared/appTelemetry/appInsightsClient';
import { TELEMETRY_PAGE_NAMES } from '../../constants/telemetry';
import { useConnectionStringContext } from '../context/connectionStringStateContext';
import { ConnectionStringCommandBar } from './commandBar';
import '../../css/_layouts.scss';
import './connectionStringsView.scss';

// tslint:disable-next-line: cyclomatic-complexity
export const ConnectionStringsView: React.FC = () => {
    const { t } = useTranslation();
    const history = useHistory();
    useBreadcrumbEntry({name: t(ResourceKeys.breadcrumb.resources)});
    const [ state, api ] = useConnectionStringContext();
    const [ connectionStringUnderEdit, setConnectionStringUnderEdit ] = React.useState<string>(undefined);

    const connectionStringsWithExpiry = state.payload;
    const synchronizationStatus = state.synchronizationStatus;

    const onUpsertConnectionString = (newConnectionString: string, connectionString: string) => {
        if (newConnectionString !== connectionString) {
            // replacing a connection string with new connection string
            api.deleteConnectionString(connectionString);
        }

        const stringWithExpiry: ConnectionStringWithExpiry = {
            connectionString: newConnectionString,
            expiration: getExpiryDateInUtcString()
        };
        api.upsertConnectionString(stringWithExpiry);
    };

    const onDeleteConnectionString = (connectionString: string) => {
        api.deleteConnectionString(connectionString);
    };

    const onSelectConnectionString = (connectionString: string) => {
        const updatedConnectionStrings = formatConnectionStrings(connectionStringsWithExpiry, connectionString);
        api.setConnectionStrings(updatedConnectionStrings);
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
        api.getConnectionStrings();
    },              []);

    React.useEffect(() => {
        AppInsightsClient.getInstance()?.trackPageView({name: TELEMETRY_PAGE_NAMES.HUBS});
    }, []); // tslint:disable-line: align

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
        <div>
            <ConnectionStringCommandBar onAddConnectionStringClick={onAddConnectionStringClick}/>
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
